// Node.js build - Full features including native PubSub

// Re-export all core features
export * from '../core/index';

// PubSub exports - will be available if dependencies are installed
// If optional dependencies are missing, these imports will fail gracefully

// MongoDB
export { MongoCRUD, MongoConfig } from '../pubsub/mongo_crud';

// Redis  
export { RedisCRUD, RedisConfig } from '../pubsub/redis_crud';

// RabbitMQ
export { RMQHandler, RMQCredentials } from '../pubsub/rmq_handler';

// MQTT
export { MqttConnector, MqttConfig, DevicePayload } from '../pubsub/mqtt_handler';

// Kafka
export { KafkaHandler, KafkaConfig } from '../pubsub/kafka_handler';

// PostgreSQL
export { PostgressCRUD, PostgresConfig } from '../pubsub/postgress_crud';