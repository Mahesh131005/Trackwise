import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React, { useState } from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function Popover1({ addEntry, onClear, totalamt }) {
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
    const formattedDate = formData.created_at.length === 7
      ? `${formData.created_at}-01`
      : formData.created_at;

    const newEntry = {
      title: formData.name,
      created_at: formattedDate, // Use the fixed date here
      description: formData.desc,
      category: formData.category,
      amount: formData.amount,
    };
    addEntry(newEntry);
    // totalamt(formData.amount);
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
    <Popover>
      {/* FIX: Flex container ensures buttons fit the width properly */}
      <div className="flex flex-row gap-2 w-full">
        <PopoverTrigger asChild>
          <Button className="flex-1">Add Expense</Button>
        </PopoverTrigger>
        <Button
          variant="destructive"
          onClick={() => onClear()}
          className="flex-1"
        >
          Clear
        </Button>
      </div>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none">New Expense</h4>
          <div className="grid gap-2">
            {[
              ["name", "Title"],
              ["created_at", "Date (YYYY-MM)"],
              ["desc", "Description"],
              ["category", "Category"],
              ["amount", "Amount"],
            ].map(([id, label]) => (
              <div key={id} className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={id} className="text-right">{label}</Label>
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
          <Button onClick={handleAdd} className="w-full">
            Save Entry
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
export { Popover1 };