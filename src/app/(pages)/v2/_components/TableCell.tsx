import {
  Row,
  Table,
  Column,
  CellContext,
} from "@tanstack/react-table"
import { useState, useEffect, ChangeEvent, useRef } from "react"
import { Student, TableMeta } from "@/types/table.types"
import "./table.css"

type Option = {
  label: string
  value: string
}

type TableCellProps = CellContext<Student, unknown> & {
  table: Table<Student>
}

export const TableCell = ({
  getValue,
  row,
  column,
  table,
}: TableCellProps) => {
  const initialValue = getValue()
  const columnMeta = column.columnDef.meta as {
    type?: string
    required?: boolean
    pattern?: string
    validate?: (value: string) => boolean
    validationMessage?: string
    options?: Option[]
  }
  const tableMeta = table.options.meta as TableMeta

  const [value, setValue] = useState(initialValue as string)
  const [validationMessage, setValidationMessage] = useState("")

  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null)

  const isRowEditing = tableMeta?.editedRows?.[row.id]
  const isThisCellActive =
    tableMeta?.activeCellEdit?.rowId === row.id &&
    tableMeta?.activeCellEdit?.columnId === column.id

  useEffect(() => {
    setValue(initialValue as string)
  }, [initialValue])

  const handleDoubleClick = () => {
    if (!isRowEditing) {
      tableMeta?.setActiveCellEdit({ rowId: row.id, columnId: column.id })
    }
  }

  const displayValidationMessage = <
    T extends HTMLInputElement | HTMLSelectElement
  >(
    e: ChangeEvent<T>
  ) => {
    if (columnMeta?.validate) {
      const isValid = columnMeta.validate(e.target.value)
      if (isValid) {
        e.target.setCustomValidity("")
        setValidationMessage("")
      } else {
        e.target.setCustomValidity(columnMeta.validationMessage || "")
        setValidationMessage(columnMeta.validationMessage || "")
      }
    } else if (e.target.validity.valid) {
      setValidationMessage("")
    } else {
      setValidationMessage(e.target.validationMessage)
    }
  }

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    displayValidationMessage(e)
    tableMeta?.updateData(
      row.index,
      column.id,
      value,
      e.target.validity.valid
    )
    tableMeta?.setActiveCellEdit(null)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      tableMeta?.updateData(row.index, column.id, value, true)
      tableMeta?.updateRow(row.index)
      tableMeta?.setActiveCellEdit(null)
    } else if (e.key === "Escape") {
      tableMeta?.revertData(row.index)
      tableMeta?.setActiveCellEdit(null)
    }
  }

  const isEditing = isRowEditing || isThisCellActive

  if (isEditing) {
    if (columnMeta?.type === "select") {
      return (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={value}
          onChange={(e) => {
            handleChange(e)
            handleBlur(e)
          }}
          onKeyDown={handleKeyDown}
          required={columnMeta?.required}
          title={validationMessage}
        >
          {columnMeta?.options?.map((option: Option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        type={columnMeta?.type || "text"}
        required={columnMeta?.required}
        pattern={columnMeta?.pattern}
        title={validationMessage}
      />
    )
  }

  return (
    <span
      onDoubleClick={handleDoubleClick}
      className="cursor-pointer flex items-center gap-2"
    >
      {value || "--"}
    </span>
  )
}
