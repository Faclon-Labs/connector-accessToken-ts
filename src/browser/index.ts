// Browser build - Core features + Web-compatible PubSub alternatives
// No Node.js dependencies

// Re-export all core features
export * from '../core/index';

// Web-compatible PubSub implementations (future)
// export { WebSocketMQTT } from './pubsub/websocket-mqtt';
// export { WebSocketKafka } from './pubsub/websocket-kafka';
// export { WebRedis } from './pubsub/web-redis';

// For now, log info about PubSub availability
console.info('iosense-sdk/browser: PubSub features use WebSocket-based implementations');