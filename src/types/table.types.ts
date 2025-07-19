export type Student = {
  id: number
  studentNumber: number
  name: string
  dateOfBirth: string
  major: string
}

export interface TableMeta {
  editedRows: Record<string, boolean>
  setEditedRows: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  validRows: Record<number, Record<string, boolean>>
  setValidRows: React.Dispatch<
    React.SetStateAction<Record<number, Record<string, boolean>>>
  >
  activeCellEdit: { rowId: string; columnId: string } | null
  setActiveCellEdit: React.Dispatch<
    React.SetStateAction<{ rowId: string; columnId: string } | null>
  >
  revertData: (rowIndex: number) => void
  updateRow: (rowIndex: number) => void
  updateData: (
    rowIndex: number,
    columnId: string,
    value: string,
    isValid: boolean
  ) => void
  addRow: () => void
  removeRow: (rowIndex: number) => void
  removeSelectedRows: (selectedRows: number[]) => void
}

export type ValidRows = Record<number, Record<string, boolean>>;
