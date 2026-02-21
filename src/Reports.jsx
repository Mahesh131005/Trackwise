import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DropdownMenuCheckboxes } from "./components/dropdr";
import { Progress } from "./components/ui/progress";
import jsPDF from "jspdf";
import domtoimage from 'dom-to-image';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61", "#00c49f", "#ffbb28", "#4635B1"];

// Helper to format numbers (4000000 => 4M)
const formatCompactNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short"
  }).format(number);
};

function Reports() {
  const reportRef = useRef();
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [monthlydata, setMonthlydata] = useState([]);
  const [catdata, setCatdata] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("thismonth");
  const [savingsTips, setSavingsTips] = useState("Loading AI suggestions...");
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);

  const downloadPDF = async () => {
    const node = reportRef.current;
    if (!node) return;
    try {
      const dataUrl = await domtoimage.toPng(node);
      const pdf = new jsPDF("p", "mm", "a4");
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const imgProps = pdf.getImageProperties(img);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = (imgProps.height * pageWidth) / imgProps.width;
        pdf.addImage(img, "PNG", 0, 0, pageWidth, pageHeight);
        pdf.save("Expense_Report.pdf");
      };
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("❌ PDF generation failed.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const month = new Date().toISOString().slice(0, 7);

        const [expRes, budgetRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/expenses`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/budgets?month=${month}`, { headers })
        ]);

        setExpenses(expRes.data);
        setBudgets(budgetRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const grouped = { thismonth: [], lastmonth: [], older: [] };

    expenses.forEach((exp) => {
      const date = new Date(exp.created_at);
      const month = date.getMonth();
      const year = date.getFullYear();
      if (month === currentMonth && year === currentYear) grouped.thismonth.push(exp);
      else if ((month === currentMonth - 1 && year === currentYear) || (currentMonth === 0 && month === 11 && year === currentYear - 1)) grouped.lastmonth.push(exp);
      else grouped.older.push(exp);
    });

    // 🟢 Updated: "Older" is back.
    setMonthlydata([
      { month: "This Month", expense: grouped.thismonth.reduce((a, b) => a + Number(b.amount), 0) },
      { month: "Last Month", expense: grouped.lastmonth.reduce((a, b) => a + Number(b.amount), 0) },
      { month: "Older", expense: grouped.older.reduce((a, b) => a + Number(b.amount), 0) },
    ]);

    const map = {};
    const entriesToChart = selectedMonth === 'all' ? expenses : grouped[selectedMonth];

    entriesToChart?.forEach((e) => {
      const cat = e.category.trim();
      map[cat] = (map[cat] || 0) + Number(e.amount);
    });

    const pieData = Object.entries(map).map(([category, value]) => ({ category, value }));
    setCatdata(pieData);
  }, [expenses, selectedMonth]);

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => (old >= 100 ? 100 : old + 15));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const generateTips = async () => {
      if (expenses.length === 0) return;
      setIsGenerating(true);
      const currentMonthStr = new Date().toISOString().slice(0, 7);
      const currentMonthExpenses = expenses.filter(e => e.created_at.startsWith(currentMonthStr));

      try {
        const tips = await axios.post(
          `${import.meta.env.VITE_API_URL}/ai/savings`,
          { expenses, budgets, currentMonthExpenses },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setSavingsTips(tips.data.tips);
      } catch (error) {
        setSavingsTips("Unable to generate tips at this time.");
      } finally {
        setIsGenerating(false);
      }
    };
    if (expenses.length > 0) generateTips();
  }, [expenses, budgets]);

  if (progress < 100) {
    return (
      <div className="p-4 w-full">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Generating Report...</h2>
        <Progress value={progress} className="w-full h-4" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="flex justify-end px-6 md:px-8 lg:px-10 py-4">
          <button
            onClick={downloadPDF}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            📥 Download Report as PDF
          </button>
        </div>
      </div>
      <div className="w-full px-6 md:px-8 lg:px-10 py-8" ref={reportRef}>
        <div className="w-full space-y-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Expense Reports</h2>
          {/* 🟢 ROW 1: Wide Responsive Grid (3 columns on large screens) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

            {/* Monthly Chart: spans 2 columns on lg for extra width */}
            <div className="md:col-span-2 lg:col-span-2 bg-[#ffffff] dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex flex-col min-h-[360px] lg:min-h-[480px] transform transition-transform duration-300 hover:-translate-y-2 animate-fadeIn">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Monthly Expense Trend</h3>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlydata} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis
                      width={60}
                      tickFormatter={formatCompactNumber}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip formatter={(value) => formatCompactNumber(value)} cursor={{ fill: 'transparent' }} />
                    <Legend />
                    <Bar dataKey="expense" fill="#6b46c1" name="Expense" radius={[10, 10, 0, 0]} minPointSize={6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right column: Pie chart + Summary stacked */}
            <div className="flex flex-col gap-8">
              <div className="bg-[#ffffff] dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex flex-col h-[340px] transform transition-transform duration-300 hover:-translate-y-2 animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Category Distribution</h3>
                  <DropdownMenuCheckboxes
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                  />
                </div>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={catdata}
                        dataKey="value"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        labelLine={false}
                      >
                        {catdata.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCompactNumber(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Summary card */}
              <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex flex-col justify-center h-[180px] animate-slideUp">
                <h4 className="text-lg font-medium text-gray-700 dark:text-white mb-2">Overview</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">₹{formatCompactNumber(totalExpenses)}</div>
                    <div className="text-sm text-gray-500 dark:text-slate-300">Total tracked</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-medium text-indigo-600 dark:text-indigo-400">{monthlydata[0]?.expense ? `₹${formatCompactNumber(monthlydata[0].expense)}` : '₹0'}</div>
                    <div className="text-sm text-gray-500 dark:text-slate-300">This month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🟢 ROW 2: Savings Tips (Full Width) */}
          <div className="w-full bg-[#ffffff] dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 transform transition-transform duration-300 hover:-translate-y-1 animate-slideUp">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 dark:text-white">
              💡 Customised Savings Tips
            </h3>
            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
              {isGenerating ? (
                <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                  <span className="animate-pulse">Analyzing your spending habits...</span>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-gray-700 dark:text-slate-200 text-sm font-sans leading-relaxed">
                  {savingsTips}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { Reports };