const express = require('express');
const { createTransaction, getTransactionsByUser } = require('../controllers/transactions.Controller');
const router = express.Router();

router.post('/', createTransaction);
router.get('/:id', getTransactionsByUser);

module.exports = router;
