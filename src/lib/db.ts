import { Lucia } from "lucia";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import pg from "pg";

// set up pool connection config
const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// tests
pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;

// Create necessary tables if they don't exist
const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS auth_user (
      id TEXT PRIMARY KEY,
      github_id INTEGER UNIQUE NOT NULL,
      username TEXT NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_session (
      id TEXT PRIMARY KEY,
      expires_at TIMESTAMPTZ NOT NULL,
      user_id TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE
    );
  `);
};

createTables().catch((err) => {
  console.error('Error creating tables:', err);
  process.exit(-1);
});

// not sure what this does rn??
export interface DatabaseUser {
	id: string;
	username: string;
	github_id: number;
}

// create adapter for lucia
export const adapter = new NodePostgresAdapter(pool, {
	user: "auth_user",
	session: "user_session"
});