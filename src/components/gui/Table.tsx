import { cn } from "@/lib/utils"
import React from "react"

export interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface CommonTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyText?: string
  className?: string
  headerClassName?: string
  rowClassName?: string
  cellClassName?: string
}

export function CommonTable<T>({
  data,
  columns,
  loading = false,
  emptyText = "No data available",
  className = "w-full text-sm border text-left",
  headerClassName = "bg-muted",
  rowClassName = "",
  cellClassName = "border px-2 py-1",
}: CommonTableProps<T>) {
  return (
    <table className={className}>
      <thead className={headerClassName}>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className={cn(cellClassName, col.className)}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columns.length} className={cellClassName}>
              Loading...
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className={cellClassName}>
              {emptyText}
            </td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowClassName}>
              {columns.map((col) => (
                <td key={col.key} className={cn(cellClassName, col.className)}>
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
