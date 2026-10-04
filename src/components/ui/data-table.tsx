export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  keyField?: string;
}

export function DataTable<T extends object>({
  columns,
  data,
  emptyMessage = "No data available.",
  keyField = "id",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-[18px] border border-line px-4 py-10 text-center text-sm text-muted">
        {emptyMessage}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-[18px] border border-line">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`bg-cream-deep px-[18px] py-3.5 text-left text-[11.5px] font-extrabold uppercase tracking-[.5px] text-forest ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const r = row as Record<string, unknown>;
            return (
              <tr
                key={(r[keyField] as string) || i}
                className="border-b border-line transition-colors hover:bg-cream"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-[18px] py-3.5 text-[13.5px] ${col.className || ""}`}
                  >
                    {col.render
                      ? col.render(row)
                      : (r[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
