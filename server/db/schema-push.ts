import pg from 'pg';
const { Pool } = pg;
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '../../shared/schema';

// Create PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Drizzle instance and push the schema
async function main() {
  console.log('Connecting to database...');
  
  const db = drizzle(pool, { schema });
  
  console.log('Migrating database schema...');
  try {
    // Drop and recreate all tables with the new schema
    // WARNING: This will delete all data in the tables
    
    // Get all tables from schema
    const tables = Object.entries(schema)
      .filter(([key, value]) => key.includes('pgTable'))
      .map(([_, value]) => value);
    
    // First drop all foreign key constraints
    await pool.query(`
      DO $$ 
      DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT tc.table_name, tc.constraint_name
                    FROM information_schema.table_constraints tc
                    WHERE tc.constraint_type = 'FOREIGN KEY') 
          LOOP
              EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' DROP CONSTRAINT ' || quote_ident(r.constraint_name) || ' CASCADE';
          END LOOP;
      END $$;
    `);
    
    // Create each table in the schema with camelCase column names
    console.log('Creating or updating tables...');
    
    // Create users table
    await pool.query(`
      DROP TABLE IF EXISTS users CASCADE;
      CREATE TABLE users (
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
    
    // Create learning_modules table
    await pool.query(`
      DROP TABLE IF EXISTS learning_modules CASCADE;
      CREATE TABLE learning_modules (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(255) NOT NULL,
        "accentColor" VARCHAR(255) NOT NULL,
        "totalLessons" INTEGER NOT NULL,
        difficulty VARCHAR(255) NOT NULL,
        duration VARCHAR(255) NOT NULL,
        topics JSONB,
        prerequisites JSONB,
        "order" INTEGER NOT NULL,
        "createdAt" TIMESTAMP,
        "updatedAt" TIMESTAMP
      )
    `);
    
    // Create lessons table
    await pool.query(`
      DROP TABLE IF EXISTS lessons CASCADE;
      CREATE TABLE lessons (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        "moduleId" INTEGER REFERENCES learning_modules(id),
        duration INTEGER NOT NULL,
        "quizId" INTEGER,
        "createdAt" TIMESTAMP,
        "updatedAt" TIMESTAMP
      )
    `);
    
    // Create user_progress table
    await pool.query(`
      DROP TABLE IF EXISTS user_progress CASCADE;
      CREATE TABLE user_progress (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "moduleId" INTEGER REFERENCES learning_modules(id),
        "lessonsCompleted" INTEGER,
        "lastLessonId" INTEGER,
        completed BOOLEAN,
        "percentageComplete" INTEGER,
        "startedAt" TIMESTAMP,
        "completedAt" TIMESTAMP
      )
    `);
    
    // Create achievements table
    await pool.query(`
      DROP TABLE IF EXISTS achievements CASCADE;
      CREATE TABLE achievements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(255) NOT NULL,
        color VARCHAR(255) NOT NULL,
        requirement VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP
      )
    `);
    
    // Create user_achievements table
    await pool.query(`
      DROP TABLE IF EXISTS user_achievements CASCADE;
      CREATE TABLE user_achievements (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "achievementId" INTEGER REFERENCES achievements(id),
        "unlockedAt" TIMESTAMP
      )
    `);
    
    // Create financial_accounts table
    await pool.query(`
      DROP TABLE IF EXISTS financial_accounts CASCADE;
      CREATE TABLE financial_accounts (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        balance INTEGER NOT NULL,
        currency VARCHAR(255) DEFAULT 'USD',
        "isConnected" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP,
        "updatedAt" TIMESTAMP
      )
    `);
    
    // Create transactions table
    await pool.query(`
      DROP TABLE IF EXISTS transactions CASCADE;
      CREATE TABLE transactions (
        id SERIAL PRIMARY KEY,
        "accountId" INTEGER REFERENCES financial_accounts(id),
        amount INTEGER NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(255),
        date TIMESTAMP,
        "isExpense" BOOLEAN DEFAULT true
      )
    `);
    
    // Create budgets table
    await pool.query(`
      DROP TABLE IF EXISTS budgets CASCADE;
      CREATE TABLE budgets (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        category VARCHAR(255) NOT NULL,
        "limit" INTEGER NOT NULL,
        period VARCHAR(255) DEFAULT 'monthly',
        "createdAt" TIMESTAMP,
        "updatedAt" TIMESTAMP
      )
    `);
    
    // Create quizzes table
    await pool.query(`
      DROP TABLE IF EXISTS quizzes CASCADE;
      CREATE TABLE quizzes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        "lessonId" INTEGER REFERENCES lessons(id),
        "passingScore" INTEGER DEFAULT 70,
        "createdAt" TIMESTAMP,
        "updatedAt" TIMESTAMP
      )
    `);
    
    // Create quiz_questions table
    await pool.query(`
      DROP TABLE IF EXISTS quiz_questions CASCADE;
      CREATE TABLE quiz_questions (
        id SERIAL PRIMARY KEY,
        "quizId" INTEGER REFERENCES quizzes(id),
        text TEXT NOT NULL,
        type VARCHAR(255) NOT NULL,
        points INTEGER DEFAULT 1,
        "order" INTEGER NOT NULL,
        explanation TEXT,
        options JSONB,
        "createdAt" TIMESTAMP,
        "updatedAt" TIMESTAMP
      )
    `);
    
    // Create quiz_attempts table
    await pool.query(`
      DROP TABLE IF EXISTS quiz_attempts CASCADE;
      CREATE TABLE quiz_attempts (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "quizId" INTEGER REFERENCES quizzes(id),
        score INTEGER NOT NULL,
        passed BOOLEAN NOT NULL,
        "timeTaken" INTEGER,
        "startedAt" TIMESTAMP,
        "completedAt" TIMESTAMP
      )
    `);
    
    // Create quiz_answers table
    await pool.query(`
      DROP TABLE IF EXISTS quiz_answers CASCADE;
      CREATE TABLE quiz_answers (
        id SERIAL PRIMARY KEY,
        "attemptId" INTEGER REFERENCES quiz_attempts(id),
        "questionId" INTEGER REFERENCES quiz_questions(id),
        "selectedOptions" JSONB,
        "isCorrect" BOOLEAN NOT NULL,
        "createdAt" TIMESTAMP
      )
    `);
    
    // Create assistant_messages table
    await pool.query(`
      DROP TABLE IF EXISTS assistant_messages CASCADE;
      CREATE TABLE assistant_messages (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        sender VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP
      )
    `);
    
    // Address circular references - link quizId in lessons to quizzes table
    await pool.query(`
      ALTER TABLE lessons ADD CONSTRAINT fk_quiz_id
      FOREIGN KEY ("quizId") REFERENCES quizzes(id);
    `);
    
    console.log('Database schema migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
  
  // Close connection
  await pool.end();
}

main().catch((error) => {
  console.error('Database setup failed:', error);
  process.exit(1);
});