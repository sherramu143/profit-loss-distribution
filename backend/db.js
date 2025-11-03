// db.js
require('dotenv').config();
const { Pool } = require('pg');

// Create a Postgres connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Supabase
});

// Optional: Test connection when this file is loaded
pool.connect()
  .then(client => {
    console.log('✅ Database connected successfully!');
    return client.query('SELECT NOW()')
      .then(res => {
        console.log('Current DB time:', res.rows[0].now);
        client.release();
      });
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.stack);
  });

module.exports = pool;
