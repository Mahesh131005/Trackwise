import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React,{useState} from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
//import { useNavigate} from "react-router-dom";

function Popover1({ addEntry,onClear,totalamt }) {
  const now = new Date();
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
const [formData, setFormData] = useState({
  name: "",
  created_at: currentMonth, 
  desc: "",
  category: "",
  amount: ""
});
const placeholders = {
  name: "e.g. Grocery",
  created_at: "e.g. 2025-07",
  desc: "e.g. Bought vegetables",
  category: "e.g. Food,EMI",
  amount: "e.g. 1500"
};
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleAdd = () => {
    const newEntry = {
      title: formData.name,
      created_at: formData.created_at,
      description: formData.desc,
      category: formData.category,
      amount: formData.amount,
    };
    addEntry(newEntry);
    totalamt(formData.amount);
  
   setFormData({
    name: "",
    created_at: currentMonth,
    desc: "",
    category: "",
    amount: ""
  });
  };
  

  return (
    <div>
    <Popover>
      <div className="flex flex-row space-y-4"><PopoverTrigger asChild>
        <button type="button" className="w-35 btn btn-primary">
          Add
        </button>
      </PopoverTrigger>
      <button type="button" onClick={()=>onClear()}className="btn w-35 btn-danger">Clear</button></div>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <h4 className="font-medium">Enter the Details</h4>
          <div className="grid gap-2">
            {[
              ["name", "Title"],
              ["created_at", "YYYY-MM"],
              ["desc", "Description"],
              ["category", "Category"],
              ["amount", "Amount"],
            ].map(([id, label]) => (
              <div key={id} className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  value={formData[id]}
                  onChange={handleChange}
                  className="col-span-2 h-8"
                  placeholder={placeholders[id]}
                />
              </div>
            ))}
          </div>
          <button onClick={handleAdd} className="btn btn-success">
            Enter
          </button>
        </div>
      </PopoverContent>
    </Popover>
    </div>
  );
}
export {Popover1};