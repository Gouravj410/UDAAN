import React from 'react';

interface TableProps<T> {
  data: T[];
  columns: { label: string; key: keyof T; render?: (value: T[keyof T]) => React.ReactNode }[];
}

export const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(({ data, columns }, ref) => {
  return (
    <table ref={ref} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
      <thead>
        <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
          {columns.map((col) => (
            <th key={String(col.key)} style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
            {columns.map((col) => (
              <td key={String(col.key)} style={{ padding: '1rem' }}>
                {col.render ? col.render(row[col.key]) : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});

Table.displayName = 'Table';
