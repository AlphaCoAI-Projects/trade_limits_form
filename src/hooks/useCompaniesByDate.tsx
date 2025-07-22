"use client"
import { useEffect, useState } from "react"
import type { Company } from "@/types/table.types"

export const useCompaniesByDate = (date?: string) => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!date) return
    setLoading(true)
    ;(async () => {
      try {
        const res = await fetch(`/api/companies-list?q=${encodeURIComponent(date)}`)
        const json = await res.json()
        setCompanies(json.data?.list ?? [])
      } finally {
        setLoading(false)
      }
    })()
  }, [date])

  return { companies, loading }
}