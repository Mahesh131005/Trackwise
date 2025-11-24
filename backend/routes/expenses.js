const express = require("express");
const router = express.Router();
const supabase = require("../db");
const { sendBudgetAlert } = require("../mailer");
const authenticate = require("../middleware/authenticate");

// Apply the authentication middleware to all routes in this router
router.use(authenticate);

// Get all expenses for a user
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", req.user.userId); // Uses ID from the custom token

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new expense
router.post("/", async (req, res) => {
  try {
    // 1. Add 'title' to this line
    const { title, category, amount, description, created_at } = req.body;
    console.log("Received expense data:", req.body);
    const { data, error } = await supabase
      .from("expenses")
      .insert([{
        user_id: req.user.userId,
        title, // 2. Add 'title' to the insert object
        category,
        amount,
        description,
        created_at
      }])
      .select();

    if (error) throw error;

    // --- Budget Check Logic ---
    const expenseDate = new Date(created_at || Date.now());
    const year = expenseDate.getUTCFullYear();
    const month = String(expenseDate.getUTCMonth() + 1).padStart(2, '0');
    const monthStr = `${year}-${month}`;

    const { data: budgetData } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', req.user.userId)
      .eq('category', category)
      .eq('month', monthStr)
      .single();

    if (budgetData) {
      const startOfMonth = `${monthStr}-01`;
      const nextMonthDate = new Date(expenseDate.getFullYear(), expenseDate.getMonth() + 1, 1);
      const endOfMonth = nextMonthDate.toISOString().split('T')[0];

      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', req.user.userId)
        .eq('category', category)
        .gte('created_at', startOfMonth)
        .lt('created_at', endOfMonth);

      const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
      const budgetAmount = Number(budgetData.amount);
      const percentage = (totalSpent / budgetAmount) * 100;

      if (percentage >= 90) {
        await sendBudgetAlert(req.user.email, category, percentage.toFixed(1), totalSpent, budgetAmount);
      }
    }
    // --------------------------

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an expense
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.userId);

    if (error) throw error;
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Import Expenses
router.post("/import", async (req, res) => {
  try {
    const { expenses } = req.body;

    if (!expenses || !Array.isArray(expenses)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const expensesWithUser = expenses.map(e => ({
      ...e,
      user_id: req.user.userId,
      created_at: e.created_at || new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from("expenses")
      .insert(expensesWithUser)
      .select();

    if (error) throw error;

    res.status(201).json({ message: `Successfully imported ${data.length} expenses.`, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;