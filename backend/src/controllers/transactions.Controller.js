const pool = require('../../db');

const getUplines = async (clientId) => {
  const query = `
    WITH RECURSIVE chain AS (
      SELECT id, parent_id, share_percent, role
      FROM users
      WHERE id = $1
      UNION ALL
      SELECT u.id, u.parent_id, u.share_percent, u.role
      FROM users u
      JOIN chain c ON u.id = c.parent_id
    )
    SELECT * FROM chain WHERE id != $1;
  `;
  const result = await pool.query(query, [clientId]);
  return result.rows;
};


const createTransaction = async (req, res) => {
  const client = await pool.connect();
  try {
    const { client_id, stake_amount, profit_loss, result_type } = req.body;
    await client.query('BEGIN');

    
    const trx = await client.query(
      `INSERT INTO transactions (client_id, stake_amount, profit_loss, result_type, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
      [client_id, stake_amount, profit_loss, result_type]
    );
    const transactionId = trx.rows[0].id;

   
    const uplines = await getUplines(client_id);

    if (result_type === 'profit') {
      
      await client.query(
        `UPDATE users SET balance = balance + $1 + $2 WHERE id = $3`,
        [stake_amount, profit_loss, client_id]
      );

      
      for (let u of uplines) {
        const deduction = profit_loss * (u.share_percent / 100);
        await client.query(
          `UPDATE users SET balance = balance - $1 WHERE id = $2`,
          [deduction, u.id]
        );
        await client.query(
          `INSERT INTO transaction_shares (transaction_id, user_id, share_amount)
           VALUES ($1, $2, $3)`,
          [transactionId, u.id, -deduction]
        );
      }
    } else if (result_type === 'loss') {
      
      await client.query(
        `UPDATE users SET balance = balance - $1 WHERE id = $2`,
        [stake_amount, client_id]
      );

      
      for (let u of uplines) {
        const gain = stake_amount * (u.share_percent / 100);
        await client.query(
          `UPDATE users SET balance = balance + $1 WHERE id = $2`,
          [gain, u.id]
        );
        await client.query(
          `INSERT INTO transaction_shares (transaction_id, user_id, share_amount)
           VALUES ($1, $2, $3)`,
          [transactionId, u.id, gain]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ message: '✅ Transaction processed successfully', transaction_id: transactionId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};


const getTransactionsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT t.*, ts.user_id, ts.share_amount
      FROM transactions t
      LEFT JOIN transaction_shares ts ON t.id = ts.transaction_id
      WHERE t.client_id = $1 OR ts.user_id = $1
      ORDER BY t.created_at DESC;
    `;
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createTransaction, getTransactionsByUser };
