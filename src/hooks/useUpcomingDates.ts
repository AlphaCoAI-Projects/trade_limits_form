import { useEffect, useState } from "react"

export const useUpcomingDates = () => {
  const [dates, setDates] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fetchUpcomingDates = async () => {
    setIsLoading(true)
    try {
    const response = await fetch("/api/upcoming-dates")
    const data = await response.json()
    setDates(data.data)
    setIsLoading(false)
    } catch (error) {
      console.error("Error fetching upcoming dates:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUpcomingDates()
  }, [])

  return {
    dates,
    isLoading
  }
}
