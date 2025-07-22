"use client"
import { useEffect, useState } from "react"

export const useUpcomingDates = () => {
  const [dates, setDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/upcoming-dates")
        const json = await res.json()
        setDates(json.data ?? [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return { dates, loading }
}
