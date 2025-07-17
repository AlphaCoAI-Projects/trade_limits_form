import { useEffect, useState } from "react"
import { toast } from "sonner"

interface FormData {
  upper_limit: string
  lower_limit: string
  super_upper_limit: string
  super_lower_limit: string
  target_pe_lower: string
  target_pe_upper: string
}

interface PatData {
  upper_limit?: number
  lower_limit?: number
  super_upper_limit?: number
  super_lower_limit?: number
  target_pe_lower?: number
  target_pe_upper?: number
}

interface Company {
  alpha_code: string
  companyname: string
}

export interface SplitsVolatilityData {
  splits: {
    sales?: number[]
    operating_profit?: number[]
    net_profit?: number[]
  }
  volatility: {
    sales?: number
    operating_profit?: number
    adjusted_pbt?: number
    adjusted_pat?: number
  }
}

const EMPTY_FORM: FormData = {
  upper_limit: "",
  lower_limit: "",
  super_upper_limit: "",
  super_lower_limit: "",
  target_pe_lower: "",
  target_pe_upper: "",
}

export const useLineItemsForm = (selectedCompany: Company | null) => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [existingLineItems, setExistingLineItems] = useState<PatData | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [hasHydrated, setHasHydrated] = useState(false)
  const [lastSavedFormData, setLastSavedFormData] = useState<FormData>(formData)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [autoSaveCountdown, setAutoSaveCountdown] = useState<number | null>(
    null
  )
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [splitsVolatility, setSplitsVolatility] =
    useState<SplitsVolatilityData | null>(null)
  const [fy26Projection, setFy26Projection] = useState<{
    ebitda?: number
    ebitda_margin?: number
    total_revenue?: number
    profit_after_tax?: number
  } | null>(null)
  const [brokerageConsensus, setBrokerageConsensus] = useState<
    {
      avg_revenue?: number
      avg_ebitda?: number
      avg_pbt?: number
      avg_pat?: number
      avg_adj_pat?: number
    } | null 
    >(null)

  useEffect(() => {
    if (!selectedCompany) return

    const fetchData = async () => {
      setHasHydrated(false)
      setLoading(true)
      setExistingLineItems(null)
      setSplitsVolatility(null)
      setBrokerageConsensus(null)

      try {
        const [patRes, svRes, projRes, bcRes] = await Promise.all([
          fetch(`/api/entries?q=${selectedCompany.alpha_code}`),
          fetch(
            `/api/splits-volatility?alpha_code=${selectedCompany.alpha_code}`
          ),
          fetch(`/api/concalls?alpha_code=${selectedCompany.alpha_code}`),
          fetch(`/api/brokerage-consensus?alpha_code=${selectedCompany.alpha_code}`),
        ])

        const patData = await patRes.json()
        const svData = await svRes.json()
        const projData = await projRes.json()
        const bcData = await bcRes.json()

        // hydrate PAT form
        if (patData?.data) {
          const data = patData.data

          const hydrated: FormData = {
            upper_limit: data.upper_limit?.toString() || "",
            lower_limit: data.lower_limit?.toString() || "",
            super_upper_limit: data.super_upper_limit?.toString() || "",
            super_lower_limit: data.super_lower_limit?.toString() || "",
            target_pe_lower: data.target_pe_lower?.toString() || "",
            target_pe_upper: data.target_pe_upper?.toString() || "",
          }

          setExistingLineItems(data)
          setFormData(hydrated)
          setLastSavedFormData(hydrated)
        } else {
          toast.info("No existing data found")
          setFormData(EMPTY_FORM)
        }

        // store splits/volatility
        if (svData?.data) {
          setSplitsVolatility(svData.data)
        }

        const fy26 = projData?.FY26

        if (
          fy26 &&
          typeof fy26 === "object" &&
          ["ebitda", "ebitda_margin", "total_revenue", "profit_after_tax"].some(
            (key) => key in fy26
          )
        ) {
          setFy26Projection({
            ebitda: fy26.ebitda ?? 0,
            ebitda_margin: fy26.ebitda_margin ?? 0,
            total_revenue: fy26.total_revenue ?? 0,
            profit_after_tax: fy26.profit_after_tax ?? 0,
          })
        } else {
          setFy26Projection(null)
        }

        if (bcData?.FY26E) {
          setBrokerageConsensus({
            avg_revenue: bcData.FY26E.avg_revenue_from_operations ?? 0,
            avg_ebitda: bcData.FY26E.avg_ebitda ?? 0,
            avg_pbt: bcData.FY26E.avg_pbt ?? 0,
            avg_pat: bcData.FY26E.avg_pat ?? 0,
            avg_adj_pat: bcData.FY26E.avg_adj_pat ?? 0,
          })
        }        

        toast.success("Loaded company data")
        setHasHydrated(true)
      } catch (err) {
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCompany])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const autoSave = async () => {
    if (!selectedCompany || !hasHydrated) return
    setIsAutoSaving(true)

    const toNullableFloat = (val: string) =>
      val.trim() === "" ? null : parseFloat(val)

    try {
      const res = await fetch(`/api/entries/${selectedCompany.alpha_code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alpha_code: selectedCompany.alpha_code,
          upper_limit: toNullableFloat(formData.upper_limit),
          lower_limit: toNullableFloat(formData.lower_limit),
          super_upper_limit: toNullableFloat(formData.super_upper_limit),
          super_lower_limit: toNullableFloat(formData.super_lower_limit),
          target_pe_lower: toNullableFloat(formData.target_pe_lower),
          target_pe_upper: toNullableFloat(formData.target_pe_upper),
        }),
      })

      if (!res.ok) throw new Error()
      setLastSavedFormData(formData)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e) {
      console.error("Autosave failed", e)
    } finally {
      setIsAutoSaving(false)
    }
  }

  useEffect(() => {
    if (!selectedCompany || !hasHydrated) return

    if (JSON.stringify(formData) === JSON.stringify(lastSavedFormData)) {
      setAutoSaveCountdown(null)
      return
    }

    setAutoSaveCountdown(5)
    const countdown = setInterval(() => {
      setAutoSaveCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdown)
          autoSave()
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [formData, hasHydrated])

  const handleSubmit = async () => {
    if (!selectedCompany) {
      toast.error("Please select a company")
      return
    }

    setLoading(true)

    const toNullableFloat = (val: string) =>
      val.trim() === "" ? null : parseFloat(val)

    try {
      const res = await fetch(`/api/entries/${selectedCompany.alpha_code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alpha_code: selectedCompany.alpha_code,
          upper_limit: toNullableFloat(formData.upper_limit),
          lower_limit: toNullableFloat(formData.lower_limit),
          super_upper_limit: toNullableFloat(formData.super_upper_limit),
          super_lower_limit: toNullableFloat(formData.super_lower_limit),
          target_pe_lower: toNullableFloat(formData.target_pe_lower),
          target_pe_upper: toNullableFloat(formData.target_pe_upper),
        }),
      })

      if (!res.ok) throw new Error()
      const result = await res.json()

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)

      toast.success(result.message || "PAT data updated successfully")
    } catch {
      toast.error("Failed to submit PAT data")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(EMPTY_FORM)
    setExistingLineItems(null)
    setSplitsVolatility(null)
    setFy26Projection(null)
    setBrokerageConsensus(null)
  }

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    resetForm,
    disabled: loading,
    existingLineItems,
    splitsVolatility,
    fy26Projection,
    brokerageConsensus,
    autoSaveCountdown,
    isAutoSaving,
    saveSuccess,
  }
}
