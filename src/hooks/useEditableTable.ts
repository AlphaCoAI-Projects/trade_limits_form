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

  const toggleEdit = async (index: number, value: boolean) => {
    if (!value) {
      const row = data[index]
      const alphaCode = row.alpha_code
  
      try {
        const res = await fetch(`/api/entries/${alphaCode}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            upper_limit: row.upper_limit,
            lower_limit: row.lower_limit,
            super_upper_limit: row.super_upper_limit,
            super_lower_limit: row.super_lower_limit,
            target_pe_lower: row.target_pe_lower,
            target_pe_upper: row.target_pe_upper,
            industry_pe: row.industry_pe,
          }),
        })
  
        const json = await res.json()
        if (!res.ok) {
          console.error("Failed to update:", json)
          alert(`Update failed for ${alphaCode}`)
        }
      } catch (e) {
        console.error("Error hitting API:", e)
        alert("Something went wrong while updating.")
      }
    }
  
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
