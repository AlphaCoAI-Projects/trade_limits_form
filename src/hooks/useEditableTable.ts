import { useState } from "react"
import type { Company } from "@/types/table.types"
import { Limits } from "./useLimits"

export const useEditableTable = (rows: Company[], limits: Record<string, Limits>) => {
  const [data, setData] = useState(() =>
    rows.map((row) => ({
      ...row,
      ...limits[row.alpha_code ?? ""] ?? {},
      isEditing: false,
    }))
  )

  const toggleEdit = (index: number, value: boolean) => {
    setData((prev) =>
      prev.map((r, i) => (i === index ? { ...r, isEditing: value } : r))
    )
  }

  const updateField = (index: number, key: keyof Limits, value: string) => {
    setData((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [key]: value } : r))
    )
  }

  const revertRow = (index: number, original: Company) => {
    setData((prev) =>
      prev.map((r, i) =>
        i === index
          ? {
              ...original,
              ...limits[original.alpha_code ?? ""] ?? {},
              isEditing: false,
            }
          : r
      )
    )
  }

  return { data, setData, toggleEdit, updateField, revertRow }
}
