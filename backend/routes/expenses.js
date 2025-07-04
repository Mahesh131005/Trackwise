const express = require("express");
const authenticate = require("../middleware/authenticate");
const supabase = require("../db");

const router = express.Router();

// Get all expenses
router.get("/", authenticate, async (req, res) => {
  const { userId } = req.user;
   console.log(req.body)
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ message: "Failed to fetch expenses" });
  res.json(data);
});
// Add expense
router.post("/", authenticate, async (req, res) => {
  const { userId } = req.user;
  const { title, amount, category, description } = req.body;

const newExpense = {
  title,
  amount,
  category,
  description,
  user_id: userId,
  // created_at is optional – let Supabase auto-fill it
};
  console.log("🧾 Inserting expense:", newExpense);


  const { data, error } = await supabase
    .from("expenses")
    .insert([newExpense])
    .single();

  if (error) {
    console.error("❌ Insert expense error:", error);
    return res.status(500).json({ message: "Failed to create expense" });
  }

  res.status(201).json(data);
});
router.post("/gemini/generate-tips", authenticate, async (req, res) => {
  const { expenses } = req.body;
  try {
    const geminiResponse = await callGeminiAPI(expenses); // your own helper
    res.json({ tips: geminiResponse });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ message: "Failed to generate tips" });
  }
});


// Delete expense
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return res.status(500).json({ message: "Failed to delete expense" });
  res.send("Expense deleted");
});

module.exports = router;
