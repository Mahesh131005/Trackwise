import React, { useState, useEffect } from "react";
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
import { Trash2, Plus, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <div className="w-full min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-200">
            <div className="w-full h-full px-6 md:px-8 lg:px-10 py-8 space-y-8">
                <h1 className="text-3xl font-bold text-foreground">Recurring Expenses</h1>

                {/* Add New Section */}
                <Card className="shadow-md w-full">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" /> Add New Subscription
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="e.g. Rent, Netflix"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
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
                            <div className="space-y-2">
                                <Label htmlFor="frequency">Frequency</Label>
                                <select
                                    id="frequency"
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleChange}
                                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <div className="space-y-2">
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
                                <Button type="submit" className="w-full md:w-auto">
                                    Save Recurring Expense
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* List Section */}
                <Card className="shadow-md w-full">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" /> Active Subscriptions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Frequency</TableHead>
                                    <TableHead>Next Due</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recurring.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No recurring expenses found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recurring.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.category}</TableCell>
                                            <TableCell>₹{item.amount}</TableCell>
                                            <TableCell className="capitalize">
                                                <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
                                                    {item.frequency}
                                                </span>
                                            </TableCell>
                                            <TableCell>{new Date(item.next_due_date).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-muted-foreground hover:text-red-600 hover:bg-red-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}