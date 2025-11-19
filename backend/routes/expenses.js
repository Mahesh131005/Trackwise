const express = require("express");
const router = express.Router();
const supabase = require("../db");
const { sendBudgetAlert } = require("../mailer");

// Get all expenses for a user
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { data: user, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.user.id);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new expense
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { data: user, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: "Unauthorized" });

    const { category, amount, description, created_at } = req.body;

    // Insert expense
    const { data, error } = await supabase
      .from("expenses")
      .insert([{ user_id: user.user.id, category, amount, description, created_at }])
      .select();

    if (error) throw error;

    // --- Budget Check Logic ---
    const expenseDate = new Date(created_at || Date.now());
    const monthStr = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;

    // 1. Get Budget for this category/month
    const { data: budgetData } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('category', category)
      .eq('month', monthStr)
      .single();

    if (budgetData) {
      // 2. Calculate total spent for this category/month
      // We need to fetch all expenses for this month/category to sum them up
      // Or we can use a sum query if Supabase supports it easily, but let's just fetch and reduce for now or use a range query
      const startOfMonth = `${monthStr}-01`;
      // Calculate end of month
      const nextMonthDate = new Date(expenseDate.getFullYear(), expenseDate.getMonth() + 1, 1);
      const endOfMonth = nextMonthDate.toISOString().split('T')[0];

      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.user.id)
        .eq('category', category)
        .gte('created_at', startOfMonth)
        .lt('created_at', endOfMonth);

      const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
      const budgetAmount = Number(budgetData.amount);
      const percentage = (totalSpent / budgetAmount) * 100;

      if (percentage >= 90) {
        // Send Alert
        await sendBudgetAlert(user.user.email, category, percentage.toFixed(1), totalSpent, budgetAmount);
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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { data: user, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.user.id);

    if (error) throw error;
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Import Expenses (Bulk Insert)
router.post("/import", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { data: user, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ error: "Unauthorized" });

    const { expenses } = req.body; // Expecting an array of expense objects

    if (!expenses || !Array.isArray(expenses)) {
      return res.status(400).json({ error: "Invalid data format. Expected array of expenses." });
    }

    // Add user_id to each expense
    const expensesWithUser = expenses.map(e => ({
      ...e,
      user_id: user.user.id,
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
