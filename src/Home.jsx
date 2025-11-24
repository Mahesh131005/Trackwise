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
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/budgets?month=${month}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
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
      entries
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
    return entries
      .filter(
        (e) =>
          e.category === category &&
          e.created_at.startsWith(monthStr)
      )
      .reduce((sum, e) => sum + Number(e.amount), 0);
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
              Total ({selectedMonth === "thismonth" ? "This Month" : selectedMonth}):
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

        {/* Quick Actions + Recent Transactions */}
        <Card className="shadow-sm w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <Popover1 addEntry={addEntry} onClear={onClear} totalamt={totalamt} />

            {/* Recent Transactions */}
            <Card className="shadow-sm w-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Recent Transactions
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Tables
                  entries={filteredEntries}
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
