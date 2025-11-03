require('dotenv').config();
const { Pool } = require('pg');


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

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
