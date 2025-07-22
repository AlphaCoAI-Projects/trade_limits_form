"use client"
import { useEffect, useState } from "react"
import type { Company } from "@/types/table.types"

export interface Limits {
  upper_limit?:        number
  lower_limit?:        number
  super_upper_limit?:  number
  super_lower_limit?:  number
  target_pe_lower?:    number
  target_pe_upper?:    number
  industry_pe?:        number
}

export const useLimits = (companies: Company[]) => {
  const [limitsMap, setLimitsMap] = useState<Record<string, Limits>>({})
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (!companies.length) return

    const codes = companies.map(c => c.alpha_code).filter(Boolean).join(",")
    if (!codes) return                     

    setLoading(true)
    ;(async () => {
      try {
        const res  = await fetch(`/api/get-all-limits?codes=${codes}`)
        const json = await res.json()
        if (json.success) setLimitsMap(json.data ?? {})
      } finally {
        setLoading(false)
      }
    })()
  }, [companies])

  return { limitsMap, loading }
}
