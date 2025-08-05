import { useState, useEffect } from "react";
import { toast } from "sonner"

interface Concall {
  year_id: number
  quarter_id: string
  processed: string
  projections?: {
    [fy: string]: {
      ebitda: number | null
      ebitda_margin: number | null
      total_revenue: number | null
      revenue_growth: number | null
      is_interest_included: boolean
      is_other_income_included: boolean
      annualized_interest: number | null
      annualized_depreciation: number | null
      other_income: number | null
      profit_after_tax: number | null
    }
  }
  documents: {
    type_of_concall: string
    url: string
    published_date: string
  }[]
}

interface BrokerageConsensus {
  FY26E?: {
    avg_revenue_from_operations?: number
    avg_ebitda?: number
    avg_other_income?: number
    avg_pbt?: number
    avg_exceptional_items?: number
    avg_tax?: number
    avg_pat?: number
    avg_adj_pat?: number
    avg_earning_multiple?: number
  }
}

interface ProjectionType {
  alpha_code: string
  concalls?: Concall[]
  brokerage_consensus?: BrokerageConsensus
}

export const useProjections = (alphaCode?: string) => {
  const [projections, setProjections] = useState<ProjectionType>();
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!alphaCode) return;
    setLoading(true);

    const fetchData = async () => {

      try {
        const res = await fetch(`/api/projections?alpha_code=${alphaCode}`)
        const json = await res.json()
        if (json.success) {setProjections(json)}

        toast.success("Loaded company data");
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData()

  },[alphaCode]);
  return {
    projections,
    loading
  };
};
