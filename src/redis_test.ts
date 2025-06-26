import { RedisCRUD, RedisConfig } from './pubsub/redis_crud.js';

// Use the Redis URI directly in the config
const config: RedisConfig = {
  uri: 'redis://cmvma_lJz5Dub:682c30bb641f9c0dbf9a4c78@cmvma_ljz5dub.iocompute.ai:6379'
};

const redis = new RedisCRUD(config);

async function run() {
  const key = 'user:123';
  const value = { name: 'Alice', age: 30 };

  try {
    await redis.connect();
    // Set
    const setResult = await redis.set(key, value, 60);
    console.log('Set result:', setResult);

    // Get
    const getResult = await redis.get<typeof value>(key);
    console.log('Get result:', getResult);

    // Exists
    const existsResult = await redis.exists(key);
    console.log('Exists result:', existsResult);

    // Update
    const updateResult = await redis.update<typeof value>(key, { age: 31 });
    console.log('Update result:', updateResult);

    // Get after update
    const getUpdated = await redis.get<typeof value>(key);
    console.log('Get after update:', getUpdated);

    // Delete
    const deleteResult = await redis.delete(key);
    console.log('Delete result:', deleteResult);

    // Exists after delete
    const existsAfterDelete = await redis.exists(key);
    console.log('Exists after delete:', existsAfterDelete);
  } catch (err) {
    console.error('Redis test failed:', err);
  } finally {
    await redis.disconnect();
    console.log('Disconnected from Redis');
  }
}

run(); 