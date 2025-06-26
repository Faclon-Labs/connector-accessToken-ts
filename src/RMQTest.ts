import { RMQHandler, RMQCredentials } from './pubsub/rmq_handler.js';

// Use the same URI format as in redis_test.ts
const uri = 'amqp://cmvma_lJz5Dub:682c30bb641f9c0dbf9a4c78@rabbitmq.iosense.io:5672';
const credentials: RMQCredentials = { uri };

const queue = 'test_FaclonGPT';
const handler = new RMQHandler(credentials);

async function runTest() {
  console.log('--- Using URI for RabbitMQ connection ---');
  // Publish a single message
  await handler.publishSingle(queue, 'Hello, RabbitMQ!');
  console.log('Published single message.');

  // Publish multiple messages
  await handler.publishMultiple(queue, ['Message 1', 'Message 2', 'Message 3']);
  console.log('Published multiple messages.');

  // Subscribe and log received messages
  await handler.subscribe(queue, (msg) => {
    console.log('Received message:', msg);
  });
  console.log('Subscription round complete.');
}

runTest().catch((err) => {
  console.error('Test failed:', err);
}); 