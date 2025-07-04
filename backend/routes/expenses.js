// routes/expenses.js
const express = require("express");
const authenticate = require("../middleware/authenticate");
const supabase = require("../db");

const router = express.Router();

// GET all expenses for this user
router.get("/", authenticate, async (req, res) => {
  try {
    const { userId } = req.user;

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Error fetching expenses:", err.message);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// Add new expense
router.post("/", authenticate, async (req, res) => {
  try {
    const { userId } = req.user;
    const newExpense = { ...req.body, user_id: userId };

    const { data, error } = await supabase
      .from("expenses")
      .insert([newExpense])
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error("Error adding expense:", err.message);
    res.status(500).json({ message: "Failed to create expense" });
  }
});

// Delete expense
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;

    res.send("Expense deleted");
  } catch (err) {
    console.error("Error deleting expense:", err.message);
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

module.exports = router;
