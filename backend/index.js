// index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware setup
app.use(cors());
app.use(express.json());

// ✅ Import AFTER middleware setup
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");

// ✅ Route mounting
app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
