import Redis, { Redis as RedisClient } from 'ioredis';
import { DEFAULT_REDIS_URL } from '../utils/constants';

/**
 * Redis connection configuration options.
 * @property {string} [uri] - Full Redis URI (overrides other fields if provided). If not provided, uses DEFAULT_REDIS_URL from constants.
 * @property {string} [host] - Redis server host.
 * @property {number} [port] - Redis server port.
 * @property {string} [username] - Username for authentication.
 * @property {string} [password] - Password for authentication.
 * @property {number} [db] - Database index to use.
 */
export interface RedisConfig {
  uri?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  db?: number;
}

// Internal interface for the resolved config
interface ResolvedRedisConfig {
  uri?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  db?: number;
}

/**
 * Redis CRUD (Create, Read, Update, Delete) utility class for key-value operations.
 *
 * Example usage:
 * ```ts
 * const config: RedisConfig = { host: 'localhost', port: 6379 }; // Uses default URI if no uri provided
 * const redis = new RedisCRUD(config);
 * await redis.set('key', { foo: 'bar' });
 * ```
 */
export class RedisCRUD {
  private config: ResolvedRedisConfig;
  private client: RedisClient | null = null;

  /**
   * Constructs a new RedisCRUD instance with the given configuration.
   * @param {RedisConfig} config - Redis connection configuration.
   */
  constructor(config: RedisConfig) {
    // Use the provided URI or fall back to the default from constants
    const finalUri = config.uri ?? DEFAULT_REDIS_URL;
    this.config = {
      ...config,
      uri: finalUri
    } as ResolvedRedisConfig;
  }

  /**
   * Connects to Redis. Call this ONCE before using CRUD methods.
   * @returns {Promise<void>} Resolves when connected.
   * @throws Will throw if connection fails.
   */
  async connect(): Promise<void> {
    if (this.client && (this.client.status === 'ready' || this.client.status === 'connecting')) return;
    try {
      if (this.config.uri) {
        this.client = new Redis(this.config.uri);
      } else {
        this.client = new Redis({
          host: this.config.host,
          port: this.config.port,
          username: this.config.username,
          password: this.config.password,
          db: this.config.db,
          lazyConnect: true,
        });
        await this.client.connect();
      }
    } catch (err) {
      console.error('Redis connection error:', err);
      throw err;
    }
  }

  /**
   * Disconnects from Redis.
   * @returns {Promise<void>} Resolves when disconnected.
   * @throws Will throw if disconnection fails.
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
        this.client = null;
      } catch (err) {
        console.error('Redis disconnect error:', err);
        throw err;
      }
    }
  }

  /**
   * Set a key with a value (as JSON), with optional expiration in seconds.
   * @param {string} key - Redis key.
   * @param {any} value - Value to store (will be stringified).
   * @param {number} [expireInSec] - Optional expiration in seconds.
   * @returns {Promise<'OK' | null>} 'OK' or null.
   * @throws Will throw if the set operation fails.
   */
  async set(key: string, value: any, expireInSec?: number): Promise<'OK' | null> {
    try {
      const val = JSON.stringify(value);
      if (expireInSec) {
        return await this.client!.set(key, val, 'EX', expireInSec);
      } else {
        return await this.client!.set(key, val);
      }
    } catch (err) {
      console.error('Redis set error:', err);
      throw err;
    }
  }

  /**
   * Get a value by key and parse as JSON.
   * @param {string} key - Redis key.
   * @returns {Promise<T | null>} Parsed value or null.
   * @throws Will throw if the get operation fails.
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const val = await this.client!.get(key);
      return val ? JSON.parse(val) : null;
    } catch (err) {
      console.error('Redis get error:', err);
      throw err;
    }
  }

  /**
   * Update an object value by merging with the existing value.
   * @param {string} key - Redis key.
   * @param {Partial<T>} value - Partial object to merge.
   * @returns {Promise<'OK' | null>} 'OK' or null.
   * @throws Will throw if the update operation fails.
   */
  async update<T = any>(key: string, value: Partial<T>): Promise<'OK' | null> {
    try {
      const existing = await this.get<T>(key);
      if (!existing || typeof existing !== 'object') {
        throw new Error('Cannot update: existing value is not an object or does not exist');
      }
      const merged = { ...existing, ...value };
      return await this.set(key, merged);
    } catch (err) {
      console.error('Redis update error:', err);
      throw err;
    }
  }

  /**
   * Delete a key.
   * @param {string} key - Redis key.
   * @returns {Promise<number>} Number of keys deleted.
   * @throws Will throw if the delete operation fails.
   */
  async delete(key: string): Promise<number> {
    try {
      return await this.client!.del(key);
    } catch (err) {
      console.error('Redis delete error:', err);
      throw err;
    }
  }

  /**
   * Check if a key exists.
   * @param {string} key - Redis key.
   * @returns {Promise<boolean>} true if key exists, false otherwise.
   * @throws Will throw if the exists operation fails.
   */
  async exists(key: string): Promise<boolean> {
    try {
      const res = await this.client!.exists(key);
      return res === 1;
    } catch (err) {
      console.error('Redis exists error:', err);
      throw err;
    }
  }
} 
