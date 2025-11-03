const express = require('express');
const { getUsers, getUserBalance, updateShare } = require('../controllers/users.Controller');
const router = express.Router();

router.get('/', getUsers);
router.get('/:id/balance', getUserBalance);
router.put('/:id/share', updateShare);

module.exports = router;
