import { createColumnHelper } from "@tanstack/react-table"
import { Company } from "@/types/table.types"
import { TableCell } from "./TableCell"
import { EditCell } from "./EditCell"

const h = createColumnHelper<Company>()

export const tableColumns = [
  h.display({ id: "edit", cell: EditCell }),
  h.accessor("company_name", {
    header: "Company",
    cell: ({ getValue }) => <span>{getValue()}</span>,
  }),

  ...(
    [
      "upper_limit",
      "lower_limit",
      "super_upper_limit",
      "super_lower_limit",
      "target_pe_lower",
      "target_pe_upper",
      "industry_pe"
    ] as const
  ).map((field) =>
    h.accessor(field, {
      header: field.replace(/_/g, " "),
      cell: TableCell,
      meta: {
        type: "number",
        required: false,
      },
    })
  ),
]
