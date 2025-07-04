import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator
} from './ui/dropdown-menu';

export function DropdownMenuCheckboxes({ selectedMonth, setSelectedMonth }) {

  const labelMap = {
    older: "Older",
    lastmonth: "Last Month",
    thismonth: "This Month"
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="">
          {labelMap[selectedMonth]}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Record</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup
          value={selectedMonth}
          onValueChange={setSelectedMonth}
        >
          <DropdownMenuRadioItem value="older">Older</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="lastmonth">Last Month</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="thismonth">This Month</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
