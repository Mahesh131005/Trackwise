import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React,{useState} from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
function Popover1({ addEntry,onClear }) {
  const [formData, setFormData] = useState({
    name: "",
    time: "",
    desc: "",
    category: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAdd = () => {
    const newEntry = {
      name: formData.name,
      time: formData.time,
      description: formData.desc,
      category: formData.category,
      amount: formData.amount,
    };
    addEntry(newEntry);
    // Optional: clear form
    setFormData({ name: "", time: "", desc: "", category: "", amount: "" });
  };

  return (
    <div>
    <Popover>
      <div className="flex flex-row"><PopoverTrigger asChild>
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
              ["name", "Name"],
              ["time", "Time"],
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