const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const usersRoutes = require('./src/routes/users.routes');
const transactionsRoutes = require('./src/routes/transactions.routes');

dotenv.config();
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
