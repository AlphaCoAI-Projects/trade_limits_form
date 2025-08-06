"use client"
import { SplitsVolatilityData } from "@/types/table.types"
import { useEffect, useState } from "react"

export interface ForecastItem {
  line_item: string
  move_back_by: number
  prediction: number
  coeff_of_variation: number
}

export const useCompanyData = (alphaCode?: string) => {
  const [forecast, setForecast] = useState<ForecastItem[]>([])
  const [splits, setSplits]   = useState<SplitsVolatilityData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!alphaCode) return
    setLoading(true)

    ;(async () => {
      try {
        const [fRes, sRes] = await Promise.all([
          fetch(`/api/quarterly-yoy?alpha_code=${alphaCode}`),
          fetch(`/api/splits-volatility?alpha_code=${alphaCode}`)
        ])

        const fJson = await fRes.json()
        const sJson = await sRes.json()

        if (fJson.success) setForecast(fJson.data)
        if (sJson.success) setSplits(sJson.data)
      } finally {
        setLoading(false)
      }
    })()
  }, [alphaCode])

  return { forecast, splits, loading }
}
