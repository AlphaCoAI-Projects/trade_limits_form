export interface Concalls {
  year_id: number
  quarter_id: string
  processed: string
  projections: {
    [fy: string]: YearValue
  }
}

export interface YearValue {
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
  profit_before_tax: number | null
}