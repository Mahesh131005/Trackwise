import React, { useState, useEffect } from "react";
import { Popover1 } from "./popover.jsx";
import { Button } from "./components/ui/button.jsx";
import axios from "axios";
import { BudgetCard } from "./components/BudgetCard";
import { AddBudgetModal } from "./components/AddBudgetModal";
import jsPDF from "jspdf";
import Tables from "./tables";
import "jspdf-autotable";
import { Download } from "lucide-react";
// Use dropd or dropdr based on which file you actually want to use. 
// Based on your file list, both exist. I will use dropd as per your previous code.
import { DropdownMenuCheckboxes } from "./components/dropd";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function Home() {
  const [totalAmount, setTotalAmt] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("thismonth");
  const [entries, setEntries] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

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
    if (year < lastMonthYear || (year === lastMonthYear && month < lastMonth))
      return "older";
    return "unknown";
  };

  // Updated filtering logic to include "all" with SAFETY CHECK
  // This prevents the "entries.filter is not a function" error
  const safeEntries = Array.isArray(entries) ? entries : [];

  const filteredEntries = safeEntries.filter((entry) => {
    if (selectedMonth === "all") return true;
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

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Ensure response data is an array
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setEntries([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const month = new Date().toISOString().slice(0, 7);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/budgets?month=${month}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setBudgets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching budgets:", err);
      setBudgets([]);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchBudgets();
  }, []);

  const addEntry = async (entry) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/expenses`, entry, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Use functional update to ensure prev is handled safely
      setEntries((prev) => [...(Array.isArray(prev) ? prev : []), entry]);
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
      if (!isNaN(amountToRemove))
        setTotalAmt((prev) => prev - amountToRemove);
      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete expense");
    }
  };

  const onClear = () => {
    setTotalAmt(0);
    setEntries([]);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,Category,Amount,Description,Date\n" +
      safeEntries
        .map(
          (e) =>
            `${e.category},${e.amount},${e.description},${e.created_at}`
        )
        .join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryTotal = (category) => {
    const monthStr = new Date().toISOString().slice(0, 7);
    const clean = (str) => str?.trim().toLowerCase() || "";

    return safeEntries
      .filter(
        (e) =>
          clean(e.category) === clean(category) &&
          e.created_at.startsWith(monthStr)
      )
      .reduce((sum, e) => sum + Number(e.amount), 0);
  };
  const handleDeleteBudget = async (id) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/budgets/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Refresh the list
      fetchBudgets();
    } catch (err) {
      console.error("Failed to delete budget:", err);
      alert("Failed to delete budget");
    }
  };
  return (
    <div className="w-screen min-h-screen px-2 md:px-4 lg:px-6 py-4">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            Overview of your financial health.
          </p>
        </div>

        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-md border border-primary/20 shadow-sm">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              Total ({selectedMonth === "all" ? "All Time" : selectedMonth === "thismonth" ? "This Month" : selectedMonth}):
            </span>
            <span className="text-lg font-bold">
              ₹{totalFilteredAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* FULL WIDTH GRID (NO RIGHT COLUMN) */}
      <div className="grid grid-cols-1 gap-6 w-full">

        {/* Monthly Budgets */}
        <Card className="shadow-sm w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Monthly Budgets
            </CardTitle>
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
                    id={budget.id}
                    category={budget.category}
                    amount={getCategoryTotal(budget.category)}
                    budget={budget.amount}
                    onDelete={handleDeleteBudget}
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

        {/* Quick Actions + Recent Transactions */}
        <Card className="shadow-sm w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <Popover1 addEntry={addEntry} onClear={onClear} totalamt={totalamt} />

            {/* Recent Transactions with Dropdown */}
            <Card className="shadow-sm w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Recent Transactions
                </CardTitle>
                <DropdownMenuCheckboxes
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                />
              </CardHeader>

              <CardContent>
                <Tables
                  entries={sortedEntries}
                  onDelete={onDelete}
                  onSort={toggleSort}
                  sortOrder={sortOrder}
                />
              </CardContent>
            </Card>

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
    </div>
  );
}

export { Home };