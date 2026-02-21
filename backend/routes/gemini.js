const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/savings", async (req, res) => {
    try {
        const { expenses, budgets, currentMonthExpenses } = req.body;

        const defaultModel = process.env.DEFAULT_MODEL || "gemini-1.5-flash";
        const model = genAI.getGenerativeModel({ model: defaultModel });

        const prompt = `
You are a financial assistant.
Analyze and provide clear savings tips.

Expenses:
${JSON.stringify(expenses)}

Budgets:
${JSON.stringify(budgets)}

Current Month:
${JSON.stringify(currentMonthExpenses)}
`;

        const result = await model.generateContent(prompt);

        res.json({ tips: result.response.text() });
    } catch (err) {
        console.error("Gemini API Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
