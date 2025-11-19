import React, { useState, useEffect } from "react";
import { AppSidebar } from "./app-sidebar";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./components/ui/table";
import axios from "axios";
import { Trash2 } from "lucide-react";

export function RecurringExpenses() {
    const [recurring, setRecurring] = useState([]);
    const [formData, setFormData] = useState({
        category: "",
        amount: "",
        description: "",
        frequency: "monthly",
        next_due_date: "",
    });

    useEffect(() => {
        fetchRecurring();
    }, []);

    const fetchRecurring = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/recurring`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setRecurring(res.data);
        } catch (err) {
            console.error("Failed to fetch recurring expenses:", err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/recurring`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchRecurring();
            setFormData({
                category: "",
                amount: "",
                description: "",
                frequency: "monthly",
                next_due_date: "",
            });
        } catch (err) {
            console.error("Failed to add recurring expense:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/recurring/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setRecurring(recurring.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Failed to delete recurring expense:", err);
        }
    };

    return (
        <div className="flex">
            <AppSidebar />
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-6">Recurring Expenses</h1>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4">Add New Recurring Expense</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g. Rent"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="e.g. 10000"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="frequency">Frequency</Label>
                            <select
                                id="frequency"
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="next_due_date">Next Due Date</Label>
                            <Input
                                id="next_due_date"
                                name="next_due_date"
                                type="date"
                                value={formData.next_due_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit">Add Recurring Expense</Button>
                        </div>
                    </form>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Next Due</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recurring.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>₹{item.amount}</TableCell>
                                    <TableCell className="capitalize">{item.frequency}</TableCell>
                                    <TableCell>{item.next_due_date}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {recurring.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">
                                        No recurring expenses found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>
        </div>
    );
}
