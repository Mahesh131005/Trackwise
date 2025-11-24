const express = require("express");
const router = express.Router();
const supabase = require("../db");
const authenticate = require("../middleware/authenticate");

// Apply middleware to all routes
router.use(authenticate);

// Get all budgets for a user
router.get("/", async (req, res) => {
    try {
        const { month } = req.query;

        // Use req.user.userId from the validated token
        let query = supabase
            .from("budgets")
            .select("*")
            .eq("user_id", req.user.userId);

        if (month) {
            query = query.eq("month", month);
        }

        const { data, error } = await query;

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Delete a budget
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from("budgets")
            .delete()
            .eq("id", id)
            .eq("user_id", req.user.userId);

        if (error) throw error;
        res.json({ message: "Budget deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Set or Update a budget
router.post("/", async (req, res) => {
    try {
        const { category, amount, month } = req.body;

        // Upsert budget using req.user.userId
        const { data, error } = await supabase
            .from("budgets")
            .upsert(
                {
                    user_id: req.user.userId,
                    category,
                    amount,
                    month,
                },
                { onConflict: 'user_id, category, month' }
            )
            .select();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;