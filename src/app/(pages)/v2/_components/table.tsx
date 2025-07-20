"use client"

import { useEffect, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Table as TanTable,
} from "@tanstack/react-table"

import { tableColumns as columns } from "./Columns"
import { useCompaniesByDate } from "@/hooks/useCompaniesByDate"
import { useUpcomingDates } from "@/hooks/useUpcomingDates"
import type { Company, ValidRows, TableMeta } from "@/types/table.types"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FormTable() {
  const [dateItem, setDateItem] = useState<string | undefined>(undefined)

  const { dates, isLoading: isDatesLoading } = useUpcomingDates()
  const { companies, isLoading: isCompaniesLoading } = useCompaniesByDate(dateItem!)

  const [data, setData] = useState<Company[]>([])
  const [editedRows, setEditedRows] = useState<Record<string, boolean>>({})
  const [validRows, setValidRows] = useState<ValidRows>({})
  const [activeCellEdit, setActiveCellEdit] =
    useState<TableMeta["activeCellEdit"]>(null)

  useEffect(() => {
    if (!companies || companies.length === 0) return

    const formatted = companies.map((c) => ({
      ...c,
      upper_limit: null,
      lower_limit: null,
      super_upper_limit: null,
      super_lower_limit: null,
      target_pe_lower: null,
      target_pe_upper: null,
      industry_pe: null,
    }))

    setData(formatted)
    setEditedRows({})
    setValidRows({})
    setActiveCellEdit(null)
  }, [companies])

  const table = useReactTable<Company>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      editedRows,
      setEditedRows,
      validRows,
      setValidRows,
      activeCellEdit,
      setActiveCellEdit,
      updateData: (
        rowIdx: number,
        colId: keyof Company,
        value: string | number | null,
        isValid: boolean
      ) => {
        setData((old) =>
          old.map((row, i) => (i === rowIdx ? { ...row, [colId]: value } : row))
        )
        setValidRows((old) => ({
          ...old,
          [rowIdx]: { ...old[rowIdx], [colId]: isValid },
        }))
      },
      addRow: () => {},
      removeRow: () => {},
      removeSelectedRows: () => {},
    },
  })

  return (
    <article className="table-container max-w-6xl mx-auto space-y-4 flex flex-col">
      <h1 className="text-center">Select upcoming results date</h1>

      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">Select Date:</Label>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={isDatesLoading}>
              {dateItem
                ? new Date(dateItem).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Select Date"}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>Available Dates</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={dateItem ?? ""}
              onValueChange={(value: string) => setDateItem(value)}
            >
              {dates.map((date) => (
                <DropdownMenuRadioItem key={date} value={date}>
                  {new Date(date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isCompaniesLoading ? (
        <p className="text-sm text-muted-foreground">Loading companies...</p>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="border px-2 py-1 bg-gray-300 text-black text-left"
                  >
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border px-2 py-1">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  )
}
