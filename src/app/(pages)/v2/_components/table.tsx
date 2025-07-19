"use client";

import { useEffect, useState } from "react";
import { Student, ValidRows } from "@/types/table.types";
import "./table.css";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./Columns";

export const FormTable = () => {
  const [data, setData] = useState<Student[]>([]);
  const [editedRows, setEditedRows] = useState({});
  const [validRows, setValidRows] = useState<ValidRows>({});
  const [activeCellEdit, setActiveCellEdit] = useState<{ rowId: string; columnId: string } | null>(null)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/db.json");
      const json = await res.json();
      setData(json.students);
    }
    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    meta: {
      editedRows,
      setEditedRows,
      validRows,
      setValidRows,
      activeCellEdit,
      setActiveCellEdit,
      revertData: (rowIndex: number) => {
       // to be removed
      },
      updateRow: (rowIndex: number) => {
        // to be removed
      },
      updateData: (rowIndex: number, columnId: string, value: string, isValid: boolean) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
        setValidRows((old) => ({
          ...old,
          [rowIndex]: { ...old[rowIndex], [columnId]: isValid },
        }));
      },
      addRow: () => {
        const id = Math.floor(Math.random() * 10000);
        const newRow: Student = {
          id,
          studentNumber: id,
          name: "",
          dateOfBirth: "",
          major: "",
        };
        setData((prev) => [...prev, newRow]);
      },
      removeRow: (rowIndex: number) => {
        setData((prev) => prev.filter((_, index) => index !== rowIndex));
      },
      removeSelectedRows: (selectedRows: number[]) => {
        setData((prev) =>
          prev.filter((_, index) => !selectedRows.includes(index))
        );
      },
    },
  });

  return (
    <article className="table-container max-w-5xl">
      <table className="w-5xl">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={table.getCenterLeafColumns().length} align="right">
              {/* <FooterCell table={table} /> */}
            </th>
          </tr>
        </tfoot>
      </table>
    </article>
  );
};
