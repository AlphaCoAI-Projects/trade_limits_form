// export type Student = {
//   id: number
//   studentNumber: number
//   name: string
//   dateOfBirth: string
//   major: string
// }

// export interface TableMeta {
//   editedRows: Record<string, boolean>
//   setEditedRows: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
//   validRows: Record<number, Record<string, boolean>>
//   setValidRows: React.Dispatch<
//     React.SetStateAction<Record<number, Record<string, boolean>>>
//   >
//   activeCellEdit: { rowId: string; columnId: string } | null
//   setActiveCellEdit: React.Dispatch<
//     React.SetStateAction<{ rowId: string; columnId: string } | null>
//   >
//   revertData: (rowIndex: number) => void
//   updateRow: (rowIndex: number) => void
//   updateData: (
//     rowIndex: number,
//     columnId: string,
//     value: string,
//     isValid: boolean
//   ) => void
//   addRow: () => void
//   removeRow: (rowIndex: number) => void
//   removeSelectedRows: (selectedRows: number[]) => void
// }

// export type ValidRows = Record<number, Record<string, boolean>>;


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
