import {
  Table as UITable,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Tables({ entries, onDelete, onSort, sortOrder }) {
  return (
    <div className="w-full min-w-6xl mt-4">
      <UITable className="w-full">
        <TableCaption>Expense Entries</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead onClick={onSort} className="cursor-pointer hover:text-blue-600">
  Amount {sortOrder === "asc" ? "↑" : "↓"}
</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
  {entries.map((entry) => (
    <TableRow key={entry.id}>
      <TableCell>{entry.title}</TableCell>
      <TableCell>{entry.created_at}</TableCell>
      <TableCell>{entry.description}</TableCell>
      <TableCell>{entry.category}</TableCell>
      <TableCell>{entry.amount}</TableCell>
      <TableCell>
        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
      </UITable>
    </div>
  );
}

export default Tables;
