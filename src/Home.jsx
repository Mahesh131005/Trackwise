import React, { useState, useEffect } from "react";
import { Popover1 } from "./popover.jsx";
import { Button } from "./components/ui/button.jsx";
import { DropdownMenuCheckboxes } from "./components/dropd.jsx";
import axios from "axios";
import { getSavingsTipsFromGemini } from "./lib/gemini.js";
import { BudgetCard } from "./components/BudgetCard";
import { AddBudgetModal } from "./components/AddBudgetModal";
import jsPDF from "jspdf";
import Tables from "./tables";
import "jspdf-autotable";
import {
  Download,
  Upload,
  FileText,
  Wallet,
  Trash2,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function Home() {
  const [savingsTips, setSavingsTips] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTipsBox, setShowTipsBox] = useState(false);
  const [totalAmount, setTotalAmt] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("thismonth");
  const [entries, setEntries] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  // --- Helper Functions ---
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

  const toggleSort = () => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const totalamt = (amt) => {
    const parsed = parseInt(amt);
    if (!isNaN(parsed)) setTotalAmt((prev) => prev + parsed);
  };

  // --- Data Fetching ---
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEntries(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const month = new Date().toISOString().slice(0, 7);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/budgets?month=${month}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  // --- Handlers ---
  const addEntry = async (entry) => {
    console.log("Current API URL:", import.meta.env.VITE_API_URL); // Add this line
    try {
      console.log("Adding expense:", entry);
      await axios.post(`${import.meta.env.VITE_API_URL}/expenses`, entry, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEntries((prev) => [...prev, entry]);
      totalamt(entry.amount);
      fetchExpenses();
    } catch (err) {
      console.error("Add expense failed:", err);
      alert("Failed to add expense");
    }
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const deletedEntry = entries.find((entry) => entry.id === id);
      const amountToRemove = parseInt(deletedEntry?.amount);
      if (!isNaN(amountToRemove)) setTotalAmt((prev) => prev - amountToRemove);
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
    const csvContent = "data:text/csv;charset=utf-8,Category,Amount,Description,Date\n"
      + entries.map(e => `${e.category},${e.amount},${e.description},${e.created_at}`).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Trackwise Expense Report", 14, 16);
    const tableColumn = ["Category", "Amount", "Description", "Date"];
    const tableRows = entries.map(entry => [
      entry.category,
      entry.amount,
      entry.description,
      new Date(entry.created_at).toLocaleDateString(),
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
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

  const getCategoryTotal = (category) => {
    const monthStr = new Date().toISOString().slice(0, 7);
    return entries
      .filter(e => e.category === category && e.created_at.startsWith(monthStr))
      .reduce((sum, e) => sum + Number(e.amount), 0);
  };

  return (
    <div className="w-screen min-h-screen px-2 md:px-4 lg:px-6 py-4">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your financial health.</p>
        </div>

        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-md border border-primary/20 shadow-sm">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              Total ({selectedMonth === 'thismonth' ? 'This Month' : selectedMonth}):
            </span>
            <span className="text-lg font-bold">₹{totalFilteredAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* GRID FULL WIDTH */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 w-full max-w-full">

        {/* LEFT SIDE */}
        <div className="col-span-4 space-y-4 w-full">
          {/* Budgets Card */}
          <Card className="shadow-sm w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Monthly Budgets</CardTitle>
              <AddBudgetModal onBudgetAdded={fetchBudgets} />
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : budgets.length > 0 ? (
                  budgets.map((budget) => (
                    <BudgetCard
                      key={budget.id}
                      category={budget.category}
                      amount={getCategoryTotal(budget.category)}
                      budget={budget.amount}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                    No budgets set for this month.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="shadow-sm w-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Popover1 addEntry={addEntry} onClear={onClear} totalamt={totalamt} />

              <Button
                variant="outline"
                className="w-full"
                onClick={handleExportCSV}
              >
                <Download className="mr-2 h-4 w-4" /> Export to CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-3 space-y-4 w-full">
          <Card className="shadow-sm w-full">{/* Quick Actions */}</Card>

          {showTipsBox && (
            <Card className="w-full bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/50 animate-in slide-in-from-right-5">
              {/* Tips Content */}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export { Home };