/**
 * KafkaHandler provides methods to connect, publish, and subscribe to Kafka topics.
 * Uses kafkajs for Kafka integration.
 */
import { Kafka, Producer, Consumer, EachMessagePayload, logLevel } from 'kafkajs';
import { DEFAULT_KAFKA_BROKER } from '../utils/constants';

/**
 * Configuration for connecting to Kafka brokers.
 * @property {string} clientId - Unique identifier for the Kafka client instance.
 * @property {string[]} [brokers] - Array of Kafka broker addresses. If not provided, uses DEFAULT_KAFKA_BROKER from constants.
 * @property {string} [groupId] - Optional consumer group ID for message consumption.
 */
export interface KafkaConfig {
  clientId: string;
  brokers?: string[];
  groupId?: string;
}

// Internal interface for the resolved config
interface ResolvedKafkaConfig {
  clientId: string;
  brokers: string[];
  groupId?: string;
}

export class KafkaHandler {
  private kafka: Kafka;
  private producer: Producer | null = null;
  private consumer: Consumer | null = null;
  private config: ResolvedKafkaConfig;

  /**
   * Initializes the KafkaHandler with the given configuration.
   * @param {KafkaConfig} config - Configuration object for Kafka connection and behavior.
   *   @param {string} config.clientId - Unique identifier for the Kafka client instance.
   *   @param {string[]} [config.brokers] - Array of Kafka broker addresses (e.g., ['localhost:9092']). If not provided, uses DEFAULT_KAFKA_BROKER.
   *   @param {string} [config.groupId] - Optional consumer group ID for message consumption.
   */
  constructor(config: KafkaConfig) {
    // Use the provided brokers or fall back to the default from constants
    this.config = {
      clientId: config.clientId,
      brokers: config.brokers ?? [DEFAULT_KAFKA_BROKER],
      groupId: config.groupId
    };
    
    this.kafka = new Kafka({
      clientId: this.config.clientId,
      brokers: this.config.brokers,
      logLevel: logLevel.ERROR
    });
  }

  /**
   * Connects the Kafka producer and consumer (if groupId is provided).
   */
  async connect(): Promise<void> {
    this.producer = this.kafka.producer();
    await this.producer.connect();
    if (this.config.groupId) {
      this.consumer = this.kafka.consumer({ groupId: this.config.groupId });
      await this.consumer.connect();
    }
  }

  /**
   * Publishes a message to a Kafka topic.
   * @param topic The topic to publish to
   * @param message The message to send (string or Buffer)
   */
  async publish(topic: string, message: string | Buffer): Promise<void> {
    if (!this.producer) throw new Error('Producer not connected');
    await this.producer.send({
      topic,
      messages: [{ value: message }]
    });
  }

  /**
   * Subscribes to a Kafka topic and handles incoming messages with the provided callback.
   * @param topic The topic to subscribe to
   * @param onMessage Callback function to handle each message
   */
  async subscribe(topic: string, onMessage: (payload: EachMessagePayload) => Promise<void> | void): Promise<void> {
    if (!this.consumer) throw new Error('Consumer not connected or groupId not set');
    await this.consumer.subscribe({ topic, fromBeginning: false });
    await this.consumer.run({
      eachMessage: async (payload) => {
        await onMessage(payload);
      }
    });
  }

  /**
   * Disconnects the producer and consumer.
   */
  async disconnect(): Promise<void> {
    if (this.producer) await this.producer.disconnect();
    if (this.consumer) await this.consumer.disconnect();
  }
}