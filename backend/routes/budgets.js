const express = require("express");
const router = express.Router();
const supabase = require("../db");

// Get all budgets for a user
router.get("/", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const { data: user, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) return res.status(401).json({ error: "Unauthorized" });

        const { month } = req.query;
        let query = supabase.from("budgets").select("*").eq("user_id", user.user.id);

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

// Set or Update a budget
router.post("/", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const { data: user, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) return res.status(401).json({ error: "Unauthorized" });

        const { category, amount, month } = req.body;

        // Upsert budget (Insert or Update if exists)
        const { data, error } = await supabase
            .from("budgets")
            .upsert(
                {
                    user_id: user.user.id,
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
