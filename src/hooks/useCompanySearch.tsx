import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { toast } from "sonner"

interface Company {
  alpha_code: string
  companyname: string
}

export const useCompanySearch = () => {
  const [companyName, setCompanyName] = useState("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [limit, setLimit] = useState(10)
  const debouncedSearchTerm = useDebounce(companyName, 500)

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setCompanies([])
      return
    }

    const fetchCompanies = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/company-name?q=${debouncedSearchTerm}`
        )
        const data = await res.json()
        setCompanies(data.data)
      } catch (err) {
        console.error("Company search error:", err)
        toast.error("Error fetching company data")
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [debouncedSearchTerm, limit])

  return {
    companyName,
    setCompanyName,
    companies,
    selectedCompany,
    setSelectedCompany,
    open,
    setOpen,
    limit,
    setLimit,
    loading,
  }
}