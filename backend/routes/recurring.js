const express = require("express");
const router = express.Router();
const supabase = require("../db");
const authenticate = require("../middleware/authenticate");

// Apply middleware to all routes
router.use(authenticate);

// Get all recurring expenses
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("recurring_expenses")
            .select("*")
            .eq("user_id", req.user.userId);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a recurring expense
router.post("/", async (req, res) => {
    try {
        const { category, amount, description, frequency, next_due_date } = req.body;

        const { data, error } = await supabase
            .from("recurring_expenses")
            .insert([
                {
                    user_id: req.user.userId,
                    category,
                    amount,
                    description,
                    frequency,
                    next_due_date,
                },
            ])
            .select();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a recurring expense
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from("recurring_expenses")
            .delete()
            .eq("id", id)
            .eq("user_id", req.user.userId);

        if (error) throw error;
        res.json({ message: "Recurring expense deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;