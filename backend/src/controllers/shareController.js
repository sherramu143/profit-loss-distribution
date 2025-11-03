// src/controllers/shareController.js
const { createUser, getUserById } = require('../services/shareService');

const createUserController = async (req, res) => {
  try {
    const { name, role, share_percent, parent_id } = req.body;
    const user = await createUser(name, role, share_percent, parent_id);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createUserController,
  getUserController,
};
