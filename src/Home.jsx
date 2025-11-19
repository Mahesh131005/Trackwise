// Home.jsx
import React, { useState, useEffect } from "react";
import { AppSidebar } from "./app-sidebar.jsx";
import Tables from "./tables.jsx";
import { Popover1 } from "./popover.jsx";
import { Button } from "./components/ui/button.jsx";
import { DropdownMenuCheckboxes } from "./components/dropd.jsx";
import axios from "axios";
import { getSavingsTipsFromGemini } from "./lib/gemini.js";
import { BudgetCard } from "./components/BudgetCard";
import { AddBudgetModal } from "./components/AddBudgetModal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Download, Upload, FileText } from "lucide-react";

function Home() {
  const [savingsTips, setSavingsTips] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTipsBox, setShowTipsBox] = useState(false);
  const [totalAmount, setTotalAmt] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("thismonth");
  const [entries, setEntries] = useState([]);
  const [budgets, setBudgets] = useState([]);
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

  const fetchBudgets = async () => {
    try {
      const month = new Date().toISOString().slice(0, 7);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/budgets?month=${month}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBudgets(res.data);
    } catch (err) {
      console.error("Error fetching budgets:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchBudgets();
  }, []);

  const addEntry = async (entry) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/expenses`, entry, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEntries((prev) => [...prev, entry]);
      totalamt(entry.amount);
      fetchExpenses(); // Refresh to update budget progress if needed
    } catch (err) {
      console.error("Add expense failed:", err.response?.data || err.message);
      alert("Failed to add expense");
    }
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const deletedEntry = entries.find((entry) => entry.id === id);
      const amountToRemove = parseInt(deletedEntry?.amount);

      if (!isNaN(amountToRemove)) {
        setTotalAmt((prev) => prev - amountToRemove);
      }

      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
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

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Category,Amount,Description,Date\n"
      + entries.map(e => `${e.category},${e.amount},${e.description},${e.created_at}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Trackwise Expense Report", 14, 16);
    const tableColumn = ["Category", "Amount", "Description", "Date"];
    const tableRows = [];

    entries.forEach(entry => {
      const entryData = [
        entry.category,
        entry.amount,
        entry.description,
        new Date(entry.created_at).toLocaleDateString(),
      ];
      tableRows.push(entryData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("expenses.pdf");
  };

  const handleImportCSV = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const lines = text.split("\n");
      const expenses = [];
      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const [category, amount, description, created_at] = line.split(",");
          if (category && amount) {
            expenses.push({
              category: category.trim(),
              amount: parseFloat(amount.trim()),
              description: description?.trim() || "",
              created_at: created_at?.trim() || new Date().toISOString()
            });
          }
        }
      }

      if (expenses.length > 0) {
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/expenses/import`, { expenses }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          alert(`Imported ${expenses.length} expenses successfully!`);
          fetchExpenses();
        } catch (err) {
          console.error("Import failed:", err);
          alert("Failed to import expenses.");
        }
      }
    };
    reader.readAsText(file);
  };

  // Calculate budget progress
  const getCategoryTotal = (category) => {
    const monthStr = new Date().toISOString().slice(0, 7);
    return entries
      .filter(e => e.category === category && e.created_at.startsWith(monthStr))
      .reduce((sum, e) => sum + Number(e.amount), 0);
  };

  return (
    <div>
      <main className="w-full flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Track Wise</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Budget Section */}
            <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-white">Monthly Budgets</h2>
                <AddBudgetModal onBudgetAdded={fetchBudgets} />
              </div>
              <div className="space-y-4">
                {budgets.map(budget => (
                  <BudgetCard
                    key={budget.id}
                    category={budget.category}
                    amount={getCategoryTotal(budget.category)}
                    budget={budget.amount}
                  />
                ))}
                {budgets.length === 0 && <p className="text-gray-500">No budgets set for this month.</p>}
              </div>
            </div>

            {/* Actions Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col gap-4">
              <h2 className="text-xl font-semibold dark:text-white mb-2">Actions</h2>
              <Popover1 addEntry={addEntry} onClear={onClear} totalamt={totalamt} />
              <Button onClick={handleCustomSavings} variant="secondary">Customised Saving Tips</Button>
              <div className="flex gap-2">
                <Button onClick={handleExportCSV} variant="outline" size="sm" className="flex-1">
                  <FileText className="mr-2 h-4 w-4" /> CSV
                </Button>
                <Button onClick={handleExportPDF} variant="outline" size="sm" className="flex-1">
                  <Download className="mr-2 h-4 w-4" /> PDF
                </Button>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" /> Import CSV
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <DropdownMenuCheckboxes selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
          </div>

          <div className="bg-white dark:bg-gray-800 w-full rounded-lg shadow p-6">
            <Tables entries={sortedEntries} onDelete={onDelete} onSort={toggleSort} sortOrder={sortOrder} />

            {showTipsBox && (isGenerating || savingsTips) && (
              <div className="mt-6 p-4 border rounded-md bg-white dark:bg-gray-700 shadow relative max-w-4xl">
                <h2 className="text-lg font-semibold mb-2 dark:text-white">💡 AI Savings Suggestions</h2>
                <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 text-sm overflow-y-auto max-h-72">
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

            <div className="absolute top-4 right-6 z-50 text-lg font-semibold bg-white dark:bg-gray-800 dark:text-white px-4 py-2 rounded shadow-md">
              Total ({selectedMonth}): ₹{totalFilteredAmount}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export { Home };
