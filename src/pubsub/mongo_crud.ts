import { MongoClient, Db, Collection, InsertOneResult, Filter, UpdateFilter, UpdateResult, DeleteResult, Document } from 'mongodb';
import { DEFAULT_MONGO_URL } from '../utils/constants';

/**
 * Configuration options for connecting to a MongoDB database and collection.
 * @property {string} [uri] - The full MongoDB connection URI (e.g., 'mongodb://localhost:27017'). If not provided, uses DEFAULT_MONGO_URL from constants.
 * @property {string} dbName - The name of the database to connect to.
 * @property {string} collectionName - The name of the collection to operate on.
 */
export interface MongoConfig {
  uri?: string;          // Full MongoDB connection URI (optional)
  dbName: string;        // Database name
  collectionName: string;// Collection to operate on
}

// Internal interface for the resolved config
interface ResolvedMongoConfig {
  uri: string;           // Full MongoDB connection URI (always defined)
  dbName: string;        // Database name
  collectionName: string;// Collection to operate on
}

/**
 * Generic MongoDB CRUD (Create, Read, Update, Delete) class for managing documents in a collection.
 *
 * @template T - The document type extending MongoDB's Document interface.
 *
 * Example usage:
 * ```ts
 * const config: MongoConfig = { dbName: 'test', collectionName: 'users' }; // Uses default URI
 * const userCrud = new MongoCRUD<User>(config);
 * await userCrud.create({ name: 'Alice', age: 30 });
 * ```
 */
export class MongoCRUD<T extends Document> {
  private config: ResolvedMongoConfig;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private collection: Collection<T> | null = null;

  /**
   * Constructs a new MongoCRUD instance with the given configuration.
   * @param {MongoConfig} config - MongoDB connection and collection configuration.
   */
  constructor(config: MongoConfig) {
    // Use the provided URI or fall back to the default from constants
    const finalUri = config.uri ?? DEFAULT_MONGO_URL;
    this.config = {
      ...config,
      uri: finalUri
    } as ResolvedMongoConfig;
  }

  /**
   * Establishes a connection to MongoDB if not already connected.
   * Reuses the existing connection if one is already open.
   * @throws Will throw an error if the connection fails.
   * @returns {Promise<void>}
   */
  async connect(): Promise<void> {
    if (this.client) {
      return;
    }
    try {
      this.client = new MongoClient(this.config.uri);
      await this.client.connect();
      this.db = this.client.db(this.config.dbName);
      this.collection = this.db.collection<T>(this.config.collectionName);
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw err;
    }
  }

  /**
   * Closes the MongoDB connection and cleans up resources.
   * Safe to call multiple times; does nothing if not connected.
   * @throws Will throw an error if disconnection fails.
   * @returns {Promise<void>}
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.close();
        this.client = null;
        this.db = null;
        this.collection = null;
      } catch (err) {
        console.error('MongoDB disconnect error:', err);
        throw err;
      }
    }
  }

  /**
   * Inserts a single document into the collection.
   * @param {T} doc - The document to insert.
   * @throws Will throw an error if the insert operation fails.
   * @returns {Promise<InsertOneResult<T>>} The result of the insert operation.
   */
  async create(doc: T): Promise<InsertOneResult<T>> {
    await this.connect();
    try {
      return await this.collection!.insertOne(doc as import('mongodb').OptionalUnlessRequiredId<T>);
    } catch (err) {
      console.error('MongoDB create error:', err);
      throw err;
    }
  }

  /**
   * Finds documents in the collection matching the provided filter.
   * @param {Filter<T>} [filter={}] - The MongoDB filter to match documents (optional, defaults to all documents).
   * @throws Will throw an error if the read operation fails.
   * @returns {Promise<WithId<T>[]>} An array of documents matching the filter, each with an _id field.
   */
  async read(filter: Filter<T> = {}): Promise<import('mongodb').WithId<T>[]> {
    await this.connect();
    try {
      return await this.collection!.find(filter).toArray();
    } catch (err) {
      console.error('MongoDB read error:', err);
      throw err;
    }
  }

  /**
   * Updates all documents matching the provided filter with the specified update operations.
   * @param {Filter<T>} filter - The MongoDB filter to match documents.
   * @param {UpdateFilter<T>} update - The update operations to apply.
   * @throws Will throw an error if the update operation fails.
   * @returns {Promise<UpdateResult>} The result of the update operation.
   */
  async update(filter: Filter<T>, update: UpdateFilter<T>): Promise<UpdateResult> {
    await this.connect();
    try {
      return await this.collection!.updateMany(filter, update);
    } catch (err) {
      console.error('MongoDB update error:', err);
      throw err;
    }
  }

  /**
   * Deletes all documents matching the provided filter from the collection.
   * @param {Filter<T>} filter - The MongoDB filter to match documents.
   * @throws Will throw an error if the delete operation fails.
   * @returns {Promise<DeleteResult>} The result of the delete operation.
   */
  async delete(filter: Filter<T>): Promise<DeleteResult> {
    await this.connect();
    try {
      return await this.collection!.deleteMany(filter);
    } catch (err) {
      console.error('MongoDB delete error:', err);
      throw err;
    }
  }
} 