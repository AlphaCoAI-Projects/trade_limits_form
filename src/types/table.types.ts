export interface Company {
  alpha_code: string
  company_name: string
  upper_limit: number | null
  lower_limit: number | null
  super_upper_limit: number | null
  super_lower_limit: number | null
  target_pe_lower: number | null
  target_pe_upper: number | null
  industry_pe: number | null
}

export interface CompanyV2 {
  alpha_code: string
  companyname: string
  upper_limit: number | null
  lower_limit: number | null
  super_upper_limit: number | null
  super_lower_limit: number | null
  target_pe_lower: number | null
  target_pe_upper: number | null
  industry_pe: number | null
}

export interface SplitsVolatilityData {
  splits: {
    sales?: number[]
    operating_profit?: number[]
    net_profit?: number[]
    adjusted_pbt?: number[]
  }
  volatility: {
    sales?: number
    operating_profit?: number
    adjusted_pbt?: number
    adjusted_pat?: number
  }
  splits_volatility: {
    sales?: number[];
    operating_profit?: number[];
    net_profit?: number[];
    adjusted_pbt?: number[];
  }
}

export type ValidRows = Record<number, Record<keyof Company, boolean>>

export interface TableMeta {
  editedRows: Record<string, boolean>
  setEditedRows: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >
  validRows: ValidRows
  setValidRows: React.Dispatch<React.SetStateAction<ValidRows>>
  activeCellEdit: { rowId: string; columnId: keyof Company } | null
  setActiveCellEdit: React.Dispatch<
    React.SetStateAction<
      { rowId: string; columnId: keyof Company } | null
    >
  >

  /** Table‑level helpers */
  revertData: (rowIdx: number) => void
  updateRow: (rowIdx: number) => void
  updateData: (
    rowIdx: number,
    columnId: keyof Company,
    value: string,
    isValid: boolean
  ) => void
}
