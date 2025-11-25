export async function getSavingsTipsFromGemini(expenses, budgets = [], currentMonthExpenses = []) {
  // 1. Retrieve Key securely
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    console.error("❌ Missing API Key: Make sure VITE_GEMINI_API_KEY is in your .env file");
    return "Error: Missing Gemini API Key.";
  }

  // 2. Construct the prompt
  const prompt = `
You are a smart financial assistant. Analyze this user's financial data and give customized savings tips.
Make it short, effective, and clean text (no JSON).

Data:
1. All Expenses: ${JSON.stringify(expenses, null, 2)}
2. Monthly Budgets: ${JSON.stringify(budgets, null, 2)}
3. Current Month Expenses: ${JSON.stringify(currentMonthExpenses, null, 2)}

Instructions:
1. Compare current month spending against budgets. Highlight any overspending.
2. Analyze spending patterns from all expenses.
3. Provide specific, actionable savings suggestions based on this data.
  `;

  try {
    // 3. Use the CORRECT Model: gemini-1.5-flash
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      console.error(`❌ Gemini API Error: ${res.status} ${res.statusText}`);
      const errorData = await res.json();
      console.error("Details:", errorData);
      return `Gemini API error: ${res.status} (${errorData.error?.message || "Unknown"})`;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
    return text;

  } catch (error) {
    console.error("❌ Gemini API Call Failed:", error);
    return "Gemini error: " + error.message;
  }
}