export async function getSavingsTipsFromGemini(allEntries) {
  const API_KEY = "AIzaSyBxM22f5BjVB-hVV5ZMRlp8bOU9ub2RAcw"; 

  const prompt = `
You are a smart financial assistant. Analyze this user's expense data (array of entries), and give suggestions on topics given below ,make it short and effective
just deliver clean text and not any json objects,,it should be clear to use:
1. Savings suggestions: where to reduce, how to optimize for each entry.
2. Highlight categories with overspending.

Data:
${JSON.stringify(allEntries, null, 2)}
  `;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
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
      console.error("Failed to fetch from Gemini:", res.statusText);
      return "Gemini API error: " + res.status;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
    return text;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    return "Gemini error: " + error.message;
  }
}
