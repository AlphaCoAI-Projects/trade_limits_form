import { useEffect, useState } from "react"

export const useCompaniesByDate = (date: string | null) => {
  const [companies, setCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log("Triggering fetch for:", date)
    if (!date) return

    const fetchCompaniesByDate = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/companies-list?q=${encodeURIComponent(date)}`)
        const json = await res.json()

        console.log("Fetched companies list:", json)

        if (res.ok && json.success) {
          setCompanies(json.data.list || [])
        } else {
          setCompanies([])
        }
      } catch (err) {
        console.error("Error fetching companies:", err)
        setCompanies([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompaniesByDate()
  }, [date])

  return { companies, isLoading }
}
