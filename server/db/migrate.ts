import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';

// Create PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Drizzle instance
const db = drizzle(pool);

// Run migrations
async function main() {
  console.log('Running migrations...');
  
  // Migration from schema definition
  await migrate(db, { migrationsFolder: path.join(__dirname, 'migrations') });
  
  console.log('Migrations completed!');
  
  // Close connection
  await pool.end();
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});