export async function getSavingsTipsFromGemini(
  expenses,
  budgets = [],
  currentMonthExpenses = []
) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    console.error("❌ Missing API Key");
    return "Error: Missing Gemini API Key.";
  }

  const systemPart = `
You are a financial analysis AI.
Provide short, actionable savings tips.
Do NOT output JSON.
`;

  const userPrompt = `
${systemPart}

Analyze this user's financial data:

All Expenses:
${JSON.stringify(expenses, null, 2)}

Monthly Budgets:
${JSON.stringify(budgets, null, 2)}

Current Month Expenses:
${JSON.stringify(currentMonthExpenses, null, 2)}

Tasks:
1. Compare spending vs budget.
2. Highlight overspending.
3. Identify patterns.
4. Provide 4–7 savings tips.
`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("❌ Gemini API Error:", err);
      return `Gemini API error: ${err.error?.message}`;
    }

    const data = await res.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini."
    );

  } catch (error) {
    console.error("❌ Gemini API Failed:", error);
    return "Gemini Error: " + error.message;
  }
}
