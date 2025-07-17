import { Label } from "@/components/ui/label"

interface ProjectionTableProps {
  concalls: {
    year_id: number
    quarter_id: string
    projections: {
      [fy: string]: {
        [metric: string]: number | boolean | null
      }
    }
  }[]
}

export const ProjectionTable = ({ concalls }: ProjectionTableProps) => {
  if (!concalls || concalls.length === 0) {
    return <p className="text-muted-foreground italic">No projections available</p>
  }

  // Get all unique fiscal years across all concalls and sort them
//   const fiscalYears = Array.from(
//     new Set(
//       concalls.flatMap((c) => Object.keys(c.projections || {}))
//     ).sort())

const fiscalYears = Array.from(
    new Set(
      concalls.flatMap((c) => Object.keys(c.projections || {}))
    )
  ).sort()

  // Only include these specific metrics
  const metricFields = ['ebitda', 'total_revenue', 'profit_after_tax']

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Concall Projections</h3>
      <div className="overflow-auto border rounded-md">
        <table className="min-w-[600px] w-full text-sm text-left border-collapse">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-2 border">Quarter</th>
              <th className="px-4 py-2 border">Year</th>
              {fiscalYears.map((fy) => (
                <th key={fy} colSpan={metricFields.length} className="px-4 py-2 border text-center">
                  {fy}
                </th>
              ))}
            </tr>
            <tr>
              <th className="px-4 py-2 border"></th>
              <th className="px-4 py-2 border"></th>
              {fiscalYears.flatMap(fy => 
                metricFields.map(metric => (
                  <th key={`${fy}-${metric}`} className="px-4 py-2 border">
                    {metric.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {concalls.map((call, idx) => (
              <tr key={`${call.year_id}-${call.quarter_id}-${idx}`} className="border-t">
                <td className="px-4 py-2 border">{call.quarter_id.toUpperCase()}</td>
                <td className="px-4 py-2 border">{call.year_id}</td>
                {fiscalYears.flatMap(fy => 
                  metricFields.map(metric => {
                    const value = call.projections?.[fy]?.[metric]
                    return (
                      <td key={`${fy}-${metric}-${call.year_id}-${call.quarter_id}`} 
                          className="px-4 py-2 border text-muted-foreground">
                        {typeof value === "number"
                          ? value.toFixed(2)
                          : typeof value === "boolean"
                          ? value ? "Yes" : "No"
                          : "-"}
                      </td>
                    )
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}