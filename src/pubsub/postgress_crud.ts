import { Pool, PoolClient, QueryResult } from 'pg';
import { DEFAULT_POSTGRES_HOST, DEFAULT_POSTGRES_USER, DEFAULT_POSTGRES_PORT } from '../utils/constants';

/**
 * Configuration options for connecting to a PostgreSQL database.
 * @property {string} [user] - Database user. Defaults to DEFAULT_POSTGRES_USER from constants.
 * @property {string} [host] - Database host address. Defaults to DEFAULT_POSTGRES_HOST from constants.
 * @property {string} database - Database name.
 * @property {string} [password] - User password (optional).
 * @property {number} [port] - Database port number. Defaults to DEFAULT_POSTGRES_PORT from constants.
 */
export interface PostgresConfig {
  user?: string;
  host?: string;
  database: string;
  password?: string;
  port?: number;
}

// Internal interface for the resolved config
interface ResolvedPostgresConfig {
  user: string;
  host: string;
  database: string;
  password?: string;
  port: number;
}

/**
 * CRUD utility class for PostgreSQL using the 'pg' library.
 * Provides methods for connecting, creating, reading, updating, and deleting records.
 *
 * Example usage:
 * ```ts
 * const config: PostgresConfig = { user: 'postgres', host: 'localhost', database: 'test', password: 'pass', port: 5432 };
 * const pgCrud = new PostgressCRUD(config);
 * await pgCrud.create('users', { name: 'Alice', age: 30 });
 * ```
 */
export class PostgressCRUD {
  private pool: Pool;

  /**
   * Constructs a new PostgressCRUD instance with the given configuration.
   * @param {PostgresConfig} config - PostgreSQL connection configuration.
   */
  constructor(config: PostgresConfig) {
    // Use the provided values or fall back to the defaults from constants
    const resolvedConfig: ResolvedPostgresConfig = {
      user: config.user ?? DEFAULT_POSTGRES_USER,
      host: config.host ?? DEFAULT_POSTGRES_HOST,
      database: config.database,
      port: config.port ?? DEFAULT_POSTGRES_PORT,
      ...(config.password && { password: config.password })
    };
    
    this.pool = new Pool(resolvedConfig);
  }

  /**
   * Acquires a client from the connection pool.
   * @returns {Promise<PoolClient>} The acquired PostgreSQL client.
   */
  async connect(): Promise<PoolClient> {
    return this.pool.connect();
  }

  /**
   * Inserts a new record into the specified table.
   * @param {string} table - The table name.
   * @param {Record<string, any>} data - The data to insert as key-value pairs.
   * @returns {Promise<QueryResult>} The result of the insert operation.
   * @throws Will throw if the query fails.
   */
  async create(table: string, data: Record<string, any>): Promise<QueryResult> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    return this.pool.query(query, values);
  }

  /**
   * Reads records from the specified table, optionally filtered by a where clause.
   * @param {string} table - The table name.
   * @param {Record<string, any>} [where={}] - Optional filter as key-value pairs.
   * @returns {Promise<QueryResult>} The result of the select operation.
   * @throws Will throw if the query fails.
   */
  async read(table: string, where: Record<string, any> = {}): Promise<QueryResult> {
    const keys = Object.keys(where);
    let query = `SELECT * FROM ${table}`;
    let values: any[] = [];
    if (keys.length > 0) {
      const conditions = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
      query += ` WHERE ${conditions}`;
      values = Object.values(where);
    }
    return this.pool.query(query, values);
  }

  /**
   * Updates records in the specified table matching the where clause.
   * @param {string} table - The table name.
   * @param {Record<string, any>} data - The data to update as key-value pairs.
   * @param {Record<string, any>} where - The filter for records to update.
   * @returns {Promise<QueryResult>} The result of the update operation.
   * @throws Will throw if the query fails.
   */
  async update(table: string, data: Record<string, any>, where: Record<string, any>): Promise<QueryResult> {
    const setKeys = Object.keys(data);
    const setClause = setKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const whereKeys = Object.keys(where);
    const whereClause = whereKeys.map((key, i) => `${key} = $${setKeys.length + i + 1}`).join(' AND ');
    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
    const values = [...Object.values(data), ...Object.values(where)];
    return this.pool.query(query, values);
  }

  /**
   * Deletes records from the specified table matching the where clause.
   * @param {string} table - The table name.
   * @param {Record<string, any>} where - The filter for records to delete.
   * @returns {Promise<QueryResult>} The result of the delete operation.
   * @throws Will throw if the query fails.
   */
  async delete(table: string, where: Record<string, any>): Promise<QueryResult> {
    const keys = Object.keys(where);
    const conditions = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
    const query = `DELETE FROM ${table} WHERE ${conditions} RETURNING *`;
    const values = Object.values(where);
    return this.pool.query(query, values);
  }

  /**
   * Closes all connections in the pool.
   * @returns {Promise<void>} Resolves when the pool has ended.
   */
  async end(): Promise<void> {
    await this.pool.end();
  }
}