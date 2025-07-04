// Home.jsx
import React, { useState, useEffect } from "react";
import { AppSidebar } from "./app-sidebar.jsx";
import Tables from "./tables.jsx";
import { Popover1 } from "./popover.jsx";
import { Button } from "./components/ui/button.jsx";
import { DropdownMenuCheckboxes } from "./components/dropd.jsx";
import axios from "axios";
import { getSavingsTipsFromGemini } from "./lib/gemini.js";

function Home() {
  const [savingsTips, setSavingsTips] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTipsBox, setShowTipsBox] = useState(false);
  const [totalAmount, setTotalAmt] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("thismonth");
  const [entries, setEntries] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const getMonthLabel = (monthStr) => {
    if (!monthStr || typeof monthStr !== "string") return "unknown";
    const [year, month] = monthStr.split("-").map(Number);
    if (!year || !month) return "unknown";

    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
    const lastMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;

    if (year === thisYear && month === thisMonth) return "thismonth";
    if (year === lastMonthYear && month === lastMonth) return "lastmonth";
    if (year < lastMonthYear || (year === lastMonthYear && month < lastMonth)) return "older";

    return "unknown";
  };

  const filteredEntries = entries.filter((entry) => {
    const label = getMonthLabel(entry.created_at);
    return label === selectedMonth;
  });

  const totalFilteredAmount = filteredEntries.reduce((sum, entry) => {
    const amt = parseInt(entry.amount);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const aAmt = parseInt(a.amount);
    const bAmt = parseInt(b.amount);
    if (isNaN(aAmt) || isNaN(bAmt)) return 0;
    return sortOrder === "asc" ? aAmt - bAmt : bAmt - aAmt;
  });

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const totalamt = (amt) => {
    const parsed = parseInt(amt);
    if (!isNaN(parsed)) {
      setTotalAmt((prev) => prev + parsed);
    }
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEntries(res.data);

      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };
    fetchExpenses();
  }, []);

  const addEntry = async (entry) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/expenses`, entry, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(entry);
      console.log("Token:", localStorage.getItem("token"));
      setEntries((prev) => [...prev, entry]);
      totalamt(entry.amount);
    } catch (err) {
      console.error("Add expense failed:", err.response?.data || err.message);
      alert("Failed to add expense");
    }
  };

  const onDelete = async (idx) => {
    const entry = entries[idx];
    if (!entry || !entry.id) {
    console.error("❌ Invalid entry or missing ID:", entry);
    alert("Could not find the selected expense to delete.");
    return;
  }
    console.log("Deleting entry at index:", idx, entries[idx]);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/expenses/${entry.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const amountToRemove = parseInt(entries[idx].amount);
      if (!isNaN(amountToRemove)) {
        setTotalAmt((prev) => prev - amountToRemove);
      }
      setEntries((prevEntries) => prevEntries.filter((_, i) => i !== idx));
    } catch (err) {
      alert("Failed to delete expense");
    }
  };

  const onClear = () => {
    setTotalAmt(0);
    setEntries([]);
  };

  const handleCustomSavings = async () => {
    setIsGenerating(true);
    setSavingsTips("");
    setShowTipsBox(true);

    const tips = await getSavingsTipsFromGemini(entries);
    let index = 0;

    const typingInterval = setInterval(() => {
      setSavingsTips((prev) => prev + tips.charAt(index));
      index++;
      if (index >= tips.length) {
        clearInterval(typingInterval);
        setIsGenerating(false);
      }
    }, 20);
  };

  return (
    <div>
      <main className="w-full flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Track Wise</h1>

          <div className="flex justify-between items-center mb-6">
            <Popover1 addEntry={addEntry} onClear={onClear} totalamt={totalamt} />
            <Button onClick={handleCustomSavings}>Customised Saving Tips</Button>
            <DropdownMenuCheckboxes selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
          </div>

          <div className="bg-white w-full rounded-lg shadow p-6">
            <Tables entries={sortedEntries} onDelete={onDelete} onSort={toggleSort} sortOrder={sortOrder} />

            {showTipsBox && (isGenerating || savingsTips) && (
              <div className="mt-6 p-4 border rounded-md bg-white shadow relative max-w-4xl">
                <h2 className="text-lg font-semibold mb-2">💡 AI Savings Suggestions</h2>
                <pre className="whitespace-pre-wrap text-gray-700 text-sm overflow-y-auto max-h-72">
                  {savingsTips || "Generating..."}
                </pre>
                <button
                  className="absolute top-2 right-2 text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => navigator.clipboard.writeText(savingsTips)}
                  disabled={!savingsTips}
                >
                  Copy
                </button>
                <button
                  className="absolute top-2 right-20 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => setShowTipsBox(false)}
                >
                  Close
                </button>
              </div>
            )}

            <div className="absolute top-4 right-6 z-50 text-lg font-semibold bg-white px-4 py-2 rounded shadow-md">
              Total ({selectedMonth}): ₹{totalFilteredAmount}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export { Home };
