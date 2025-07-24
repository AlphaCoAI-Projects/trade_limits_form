import { useEffect, useState } from "react"

interface IBollingerBand {
  alpha_code: string
  calculation_date: number
  pricesales_lower_band: number
  pricesales_sma: number
  pricesales_upper_band: number
}

interface Props {
  alphaCode: string
  k: number
  windowSize: number
}

export const useBollingerBands = ({ alphaCode, k, windowSize }: Props) => {
  const [bollingerBand, setBollingerBand] = useState<IBollingerBand | null>(
    null
  )
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/bollinger-bands?alpha_code=${alphaCode}&k=${k}&window_size=${windowSize}`
        )
        const data = await response.json()

        if (Array.isArray(data.data) && data.data.length > 0) {
          const sorted = data.data.sort(
            (a: any, b: any) =>
              new Date(a.calculation_date).getTime() -
              new Date(b.calculation_date).getTime()
          )
          const latest = sorted[sorted.length - 1]
          setBollingerBand(latest)
        } else {
          setBollingerBand(null)
        }
      } catch (error) {
        console.error("Failed to fetch bollinger data:", error)
        setBollingerBand(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [alphaCode, k, windowSize])

  return {
    bollingerBand, // latest band only
    loading,
  }
}
