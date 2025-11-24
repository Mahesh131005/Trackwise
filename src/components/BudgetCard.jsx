import React from "react";
import { Progress } from "./ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

export function BudgetCard({ id, category, amount, budget, onDelete }) {
    // Calculate percentage
    const percentage = Math.min((amount / budget) * 100, 100);

    // Determine color based on usage
    let progressColor = "bg-green-500";
    if (percentage > 90) progressColor = "bg-red-500";
    else if (percentage > 60) progressColor = "bg-yellow-500";

    return (
        <Card className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col">
                    <CardTitle className="text-sm font-medium capitalize">
                        {category}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                        ₹{amount} / ₹{budget}
                    </span>
                </div>

                {/* Delete Button */}
                {onDelete && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100"
                        onClick={() => onDelete(id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <Progress value={percentage} className="h-2" indicatorColor={progressColor} />
                <p className="text-xs text-muted-foreground mt-2">
                    {percentage.toFixed(1)}% used
                </p>
            </CardContent>
        </Card>
    );
}