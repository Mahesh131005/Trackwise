require("dotenv").config();
const express = require("express");
const cors = require("cors");
//
const geminiRoute = require("./routes/gemini.js");
//
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use(cors({
  origin: ["http://localhost:5173", "https://trackwise-2tukhdmyg-k-gowri-maheshs-projects.vercel.app"],
  credentials: true,
}));
app.use("/auth", require("./routes/auth"));
app.use("/expenses", require("./routes/expenses"));
app.use("/budgets", require("./routes/budgets"));
app.use("/recurring", require("./routes/recurring"));
app.use("/ai", geminiRoute);

const { startScheduler } = require("./scheduler");
startScheduler();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
