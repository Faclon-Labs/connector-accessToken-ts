import * as amqp from 'amqplib';

/**
 * RabbitMQ connection credentials.
 * @property {string} [uri] - Full AMQP URI (overrides other fields if provided).
 * @property {string} [host] - RabbitMQ server host.
 * @property {number} [port] - RabbitMQ server port.
 * @property {string} [username] - Username for authentication.
 * @property {string} [password] - Password for authentication.
 * @property {string} [vhost] - Virtual host to connect to.
 */
export interface RMQCredentials {
  uri?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  vhost?: string;
}

/**
 * Handler for RabbitMQ (AMQP) operations: connect, publish, and subscribe.
 *
 * Example usage:
 * ```ts
 * const creds: RMQCredentials = { host: 'localhost', port: 5672, username: 'guest', password: 'guest' };
 * const rmq = new RMQHandler(creds);
 * await rmq.publishSingle('queue', 'message');
 * ```
 */
export class RMQHandler {
  private credentials: RMQCredentials;

  /**
   * Constructs a new RMQHandler instance with the given credentials.
   * @param {RMQCredentials} credentials - RabbitMQ connection credentials.
   */
  constructor(credentials: RMQCredentials) {
    this.credentials = credentials;
  }

  /**
   * Establishes a connection and channel to RabbitMQ.
   * @private
   * @returns {Promise<{connection: amqp.Connection, channel: amqp.Channel}>} The connection and channel.
   * @throws Will throw if connection fails.
   */
  private async connect() {
    let url: string;
    if (this.credentials.uri) {
      url = this.credentials.uri;
    } else {
      const { host, port, username, password, vhost } = this.credentials;
      const vhostPart = vhost ? `/${encodeURIComponent(vhost)}` : '';
      url = `amqp://${encodeURIComponent(username!)}:${encodeURIComponent(password!)}@${host}:${port}${vhostPart}`;
    }
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    return { connection, channel };
  }

  /**
   * Publish a single message to a queue.
   * @param {string} queue - The queue name.
   * @param {string} message - The message to send.
   * @returns {Promise<void>} Resolves when the message is published.
   * @throws Will throw if publishing fails.
   */
  async publishSingle(queue: string, message: string): Promise<void> {
    let connection: any = undefined;
    let channel: any = undefined;
    try {
      const result = await this.connect();
      connection = result.connection;
      channel = result.channel;
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(message));
    } catch (err) {
      console.error('Error in publishSingle:', err);
      throw err;
    } finally {
      if (channel) await channel.close().catch(() => {});
      if (connection) await connection.close().catch(() => {});
    }
  }

  /**
   * Publish multiple messages to a queue.
   * @param {string} queue - The queue name.
   * @param {string[]} messages - Array of messages to send.
   * @returns {Promise<void>} Resolves when all messages are published.
   * @throws Will throw if publishing fails.
   */
  async publishMultiple(queue: string, messages: string[]): Promise<void> {
    let connection: any = undefined;
    let channel: any = undefined;
    try {
      const result = await this.connect();
      connection = result.connection;
      channel = result.channel;
      await channel.assertQueue(queue, { durable: true });
      for (const msg of messages) {
        channel.sendToQueue(queue, Buffer.from(msg));
      }
    } catch (err) {
      console.error('Error in publishMultiple:', err);
      throw err;
    } finally {
      if (channel) await channel.close().catch(() => {});
      if (connection) await connection.close().catch(() => {});
    }
  }

  /**
   * Subscribe to a queue and process one round of messages.
   * @param {string} queue - The queue name.
   * @param {(msg: string) => void} callback - Callback to process each message.
   * @returns {Promise<void>} Resolves after processing one round.
   * @throws Will throw if subscription fails.
   */
  async subscribe(queue: string, callback: (msg: string) => void): Promise<void> {
    let connection: any = undefined;
    let channel: any = undefined;
    try {
      const result = await this.connect();
      connection = result.connection;
      channel = result.channel;
      await channel.assertQueue(queue, { durable: true });
      const onMessage = (msg: any) => {
        if (msg) {
          callback(msg.content.toString());
          channel.ack(msg);
        }
      };
      await channel.consume(queue, onMessage, { noAck: false });
      // Wait a short time to process one round, then disconnect
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error('Error in subscribe:', err);
      throw err;
    } finally {
      if (channel) await channel.close().catch(() => {});
      if (connection) await connection.close().catch(() => {});
    }
  }
}
