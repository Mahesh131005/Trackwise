import React, { useState } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";

export function AddBudgetModal({ onBudgetAdded }) {
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const month = new Date().toISOString().slice(0, 7); // YYYY-MM
            await axios.post(
                `${import.meta.env.VITE_API_URL}/budgets`,
                { category, amount, month },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setOpen(false);
            setCategory("");
            setAmount("");
            if (onBudgetAdded) onBudgetAdded();
        } catch (error) {
            console.error("Failed to set budget:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Set Budget</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set Monthly Budget</DialogTitle>
                    <DialogDescription>
                        Set a budget limit for a category for this month.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <Input
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g., Food"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g., 5000"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Budget</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
