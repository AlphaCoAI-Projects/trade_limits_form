"use client"
import { SplitsVolatilityData } from "@/types/table.types"
import { useEffect, useState } from "react"


export const useSplits = (alphaCode?: string) => {
  const [splits, setSplits]   = useState<SplitsVolatilityData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!alphaCode) return
    setLoading(true)

    ;(async () => {
      try {
        const res = await fetch(`/api/splits-volatility?alpha_code=${alphaCode}`)

        const json = await res.json()

        if (json.success) setSplits(json.data)
      } finally {
        setLoading(false)
      }
    })()
  }, [alphaCode])

  return { splits, loading }
}
