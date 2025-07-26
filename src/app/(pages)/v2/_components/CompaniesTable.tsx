import { useEditableTable } from "@/hooks/useEditableTable"
import { Eye, Edit, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Company } from "@/types/table.types"
import type { Limits } from "@/hooks/useLimits"

interface Props {
  rows: Company[]
  limits: Record<string, Limits>
  onView: (c: Company) => void
}

const limitKeys: (keyof Limits)[] = [
  "upper_limit",
  "lower_limit",
  "super_upper_limit",
  "super_lower_limit",
  "target_pe_lower",
  "target_pe_upper",
  "industry_pe",
]

export const CompaniesTable = ({ rows, limits, onView }: Props) => {
  const { data, toggleEdit, updateField, revertRow } = useEditableTable(
    rows,
    limits
  )

  return (
    <div className=" border rounded">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="border px-2 py-1 text-left bg-gray-50">Company</th>
            <th className="border px-2 py-1 bg-gray-50">Actions</th>
            {[
              "Upper Limit",
              "Lower Limit",
              "Super Upper Limit",
              "Super Lower Limit",
              "Target Pe Lower",
              "Target Pe Upper",
              "Industry PE",
            ].map((t) => (
              <th key={t} className="border px-2 py-1 bg-gray-50">
                {t}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => (
            <tr key={row.alpha_code ?? `row-${idx}`}>
              <td className="border px-2 py-1 text-left">{row.company_name}</td>

              <td className="border-b px-2 py-1">
                <div className="flex items-center gap-2 justify-center">
                  <Button
                    variant="icon"
                    size="icon"
                    onClick={() => onView(row)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  {row.isEditing ? (
                    <>
                      <Button
                        variant="icon"
                        size="icon"
                        className="text-white bg-red-500"
                        onClick={() => revertRow(idx, row)}
                        title="Cancel"
                      >
                        <X />
                      </Button>
                      <Button
                        variant="icon"
                        size="icon"
                        className="text-white bg-green-500"
                        onClick={() => toggleEdit(idx, false)}
                        title="Save"
                      >
                        <Check />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="icon"
                      size="icon"
                      onClick={() => toggleEdit(idx, true)}
                      title="Edit"
                    >
                      <Edit />
                    </Button>
                  )}
                </div>
              </td>

              {limitKeys.map((key, i) => (
                <td
                  key={i}
                  className="border px-2 py-1 text-right"
                  onDoubleClick={() => toggleEdit(idx, true)}
                >
                  {row.isEditing ? (
                    <Input
                      type="text"
                      className="text-right"
                      value={row[key] ?? ""}
                      onChange={(e) => updateField(idx, key, e.target.value)}
                    />
                  ) : (
                    row[key] ?? "—"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
