import pg from 'pg';
const { Pool } = pg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../../shared/schema';

// Create PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Drizzle instance and push the schema
async function main() {
  console.log('Connecting to database...');
  
  // Create users table
  console.log('Creating users table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      "firstName" VARCHAR(255),
      "lastName" VARCHAR(255),
      email VARCHAR(255),
      "userLevel" VARCHAR(255),
      "financialLiteracyScore" INTEGER,
      "createdAt" TIMESTAMP,
      "updatedAt" TIMESTAMP,
      settings JSONB
    )
  `);
  
  console.log('Database setup completed!');
  
  // Close connection
  await pool.end();
}

main().catch((error) => {
  console.error('Database setup failed:', error);
  process.exit(1);
});