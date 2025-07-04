import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DropdownMenuCheckboxes } from "./components/dropdr";
import { Progress } from "./components/ui/progress";
import { getSavingsTipsFromGemini } from "./lib/gemini.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
} from "recharts";
import domtoimage from 'dom-to-image';
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61", "#00c49f", "#ffbb28", "#4635B1"];

function Reports() {
  const reportRef = useRef();
  const [expenses, setExpenses] = useState([]);
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
    const fetchExpenses = async () => {
      try {
        const res = await axios.get("http://localhost:4000/expenses", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      }
    };
    fetchExpenses();
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
    setMonthlydata([
      { month: "This Month", expense: grouped.thismonth.reduce((a, b) => a + Number(b.amount), 0) },
      { month: "Last Month", expense: grouped.lastmonth.reduce((a, b) => a + Number(b.amount), 0) },
      { month: "Older", expense: grouped.older.reduce((a, b) => a + Number(b.amount), 0) },
    ]);
    const map = {};
    grouped[selectedMonth]?.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
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
      const tips = await getSavingsTipsFromGemini(expenses);
      setSavingsTips(tips);
      setIsGenerating(false);
    };
    generateTips();
  }, [expenses]);

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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📥 Download Report as PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4" ref={reportRef}>
        <div className="space-y-12">
          <h2 className="text-2xl font-semibold mb-6">Expense Reports</h2>
          <div>
            <h3 className="text-xl mb-2">Monthly Expense Trend</h3>
            <BarChart width={500} height={300} data={monthlydata}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="expense" fill="#8884d8" />
            </BarChart>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl mb-2">Category-wise Distribution</h3>
              <DropdownMenuCheckboxes
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
              />
            </div>
            <PieChart width={400} height={300}>
              <Pie
                data={catdata}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {catdata.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white shadow-md space-y-4 h-fit">
          <h3 className="text-xl font-semibold">💡 Customised Savings Tips</h3>
          {isGenerating ? (
            <p className="text-gray-600 animate-pulse">Generating tips using AI...</p>
          ) : (
            <pre className="whitespace-pre-wrap text-gray-800 text-sm">{savingsTips}</pre>
          )}
        </div>
      </div>
    </>
  );
}

export { Reports };
