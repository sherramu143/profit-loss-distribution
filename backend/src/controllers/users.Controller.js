const pool = require('../../db');

// Get all users
const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user balance
const getUserBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, role, balance FROM users WHERE id = $1',
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateShare = async (req, res) => {
  try {
    const { id } = req.params;
    const { share_percent } = req.body;

    console.log(`➡️ [updateShare] Request to update share_percent for user ID: ${id}, new value: ${share_percent}`);

    // Validation
    if (share_percent === undefined || share_percent === null) {
      return res.status(400).json({ message: "Missing 'share_percent' in request body" });
    }

    // Update only the share_percent field
    const update = await pool.query(
      `UPDATE users
       SET share_percent = $1
       WHERE id = $2
       RETURNING id, name, role, parent_id, share_percent;`,
      [share_percent, id]
    );

    if (update.rowCount === 0) {
      console.warn(`⚠️ [updateShare] No user found with ID: ${id}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ [updateShare] Share updated successfully:", update.rows[0]);
    res.json({
      message: "✅ Share percentage updated successfully",
      data: update.rows[0],
    });
  } catch (err) {
    console.error("❌ [updateShare] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getUsers, getUserBalance, updateShare };
