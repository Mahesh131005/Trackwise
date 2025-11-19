import React from "react";
import { Progress } from "./ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function BudgetCard({ category, amount, budget }) {
    const percentage = Math.min((amount / budget) * 100, 100);

    let progressColor = "bg-green-500";
    if (percentage > 90) progressColor = "bg-red-500";
    else if (percentage > 60) progressColor = "bg-yellow-500";

    return (
        <Card className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                    {category}
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                    ₹{amount} / ₹{budget}
                </span>
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
