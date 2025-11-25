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
        <h2 className="text-xl font-semibold mb-4">Generating Report...</h2>
        <Progress value={progress} className="w-full h-4" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end px-4 mb-4">
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors shadow-sm"
        >
          📥 Download Report as PDF
        </button>
      </div>

      <div className="p-4 space-y-8" ref={reportRef}>

        <h2 className="text-3xl font-bold text-gray-800">Expense Reports</h2>

        {/* 🟢 ROW 1: Charts Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Bar Chart Container */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-[400px]">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Monthly Expense Trend</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlydata} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis
                    width={50}
                    tickFormatter={formatCompactNumber}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => formatCompactNumber(value)} cursor={{ fill: 'transparent' }} />
                  <Legend />
                  {/* minPointSize={5} ensures small bars are seen even against huge "Older" data */}
                  <Bar dataKey="expense" fill="#8884d8" name="Expense" radius={[4, 4, 0, 0]} minPointSize={5} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart Container */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Category Distribution</h3>
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
        </div>

        {/* 🟢 ROW 2: Savings Tips (Full Width) */}
        <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            💡 Customised Savings Tips
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {isGenerating ? (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="animate-pulse">Analyzing your spending habits...</span>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-gray-700 text-sm font-sans leading-relaxed">
                {savingsTips}
              </pre>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

export { Reports };