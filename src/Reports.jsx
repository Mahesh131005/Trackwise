import React, { useState,useEffect } from "react";
import { DropdownMenuCheckboxes } from "./components/dropdr";
import { Progress } from "./components/ui/progress"
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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61", "#00c49f", "#ffbb28", "#4635B1"];

const dummyData = {
  thismonth: [
    { category: "Food", value: 100 },
    { category: "Rent", value: 10 },
    { category: "Medical", value: 20 },
  ],
  lastmonth: [
    { category: "Food", value: 80 },
    { category: "Rent", value: 20 },
    { category: "Medical", value: 15 },
  ],
  older: [
    { category: "Food", value: 50 },
    { category: "Rent", value: 30 },
    { category: "Medical", value: 10 },
  ]
};
const dummyMonthly = [
  { month: "This Month", expense: 50 },
  { month: "Last Month", expense: 50 },
  { month: "Older", expense: 80 },
];
function Reports() {
  const [monthlydata] = useState(dummyMonthly);
  const [catdata, setCatdata] = useState(dummyData["thismonth"]);
  const [selectedMonth, setSelectedMonth] = useState("thismonth");

  const handleCategoryMonthChange = (monthKey) => {
    setSelectedMonth(monthKey);
    setCatdata(dummyData[monthKey] || []);
  };
const [progress, setProgress] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setProgress((old) => {
      if (old >= 100) {
        clearInterval(interval);
        return 100;
      }
      return old + 15;
    });
  }, 300);

  return () => clearInterval(interval);
}, []);
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
 


   <div className="space-y-12">
        
      <h2 className="text-2xl font-semibold mb-6">Expense Reports</h2>

      {/* Bar chart for trend (all months) */}
      <div>
        <h3 className="text-xl mb-2">Monthly Expense Trend</h3>
        <BarChart width={600} height={300} data={monthlydata}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="expense" fill="#8884d8" />
        </BarChart>
      </div>

      {/* Category filter for pie chart */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl mb-2">Category-wise Distribution</h3>
          <DropdownMenuCheckboxes
            selectedMonth={selectedMonth}
            setSelectedMonth={handleCategoryMonthChange}
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
    </div></>
  );
}

export { Reports };
