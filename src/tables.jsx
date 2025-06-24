import {
  Table as UITable,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Tables({ entries,onDelete }) {
  return (
    <div className="w-full max-w-4xl mt-4">
      <UITable className="w-full">
        <TableCaption>Expense Entries</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.time}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{entry.category}</TableCell>
              <TableCell>{entry.amount}</TableCell>
              <TableCell><button type="button" onClick={()=>onDelete(index)} className="btn btn-danger">Delete</button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </UITable>
    </div>
  );
}

export default Tables;
