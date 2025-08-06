"use client"
import { CommonTable } from "@/components/gui/Table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBollingerBands } from "@/hooks/useBollingerBands"
import { ForecastItem } from "@/hooks/useCompanyData"
import {
  EMPTY_BOLLINGER_FORM,
  IBollingerFormData,
} from "@/types/bollinger.types"
import { Concalls, YearValue } from "@/types/concalls.types"
import type { Company, SplitsVolatilityData } from "@/types/table.types"
import { useEffect, useState } from "react"

interface Props {
  open: boolean
  onClose: () => void
  company: Company | null
  forecast: ForecastItem[]
  loading: boolean
  splits: SplitsVolatilityData | null
  concalls: Concalls[]
  brokerage: {
    avg_revenue?: number
    avg_ebitda?: number
    avg_pbt?: number
    avg_pat?: number
    avg_adj_pat?: number
  } | null
  concallsLoading: boolean
  brokerageLoading: boolean
  volatility: {
    sales?: number
    operating_profit?: number
    adjusted_pbt?: number
    adjusted_pat?: number
  }
  volatilityLoading: boolean
  marketCapitalization?: number
  mCapFromGroww?: number
  mCapFromGrowwLoading?: boolean
}

export const CompanyInfoModal = ({
  open,
  onClose,
  company,
  forecast,
  loading,
  splits,
  concalls,
  concallsLoading,
  brokerage,
  brokerageLoading,
  volatility,
  volatilityLoading,
  marketCapitalization,
  mCapFromGroww,
  mCapFromGrowwLoading,
}: Props) => {
  const ALL_COLUMNS = [
    { key: "calculation_date", label: "Date" },
    { key: "pricesales", label: "Pricesales" },
    { key: "adj_pbt_to_e", label: "Adj PBT" },
    { key: "p_to_e", label: "P to E" },
    { key: "pebitda", label: "P Ebitda" },
  ]

  // Default keys to show
  const defaultSelectedKeys = ["calculation_date", "pricesales"]

  const SPLIT_KEYS = [
    { key: "sales", label: "Sales" },
    { key: "operating_profit", label: "Operating Profit" },
    { key: "net_profit", label: "Net Profit" },
    { key: "adjusted_pbt", label: "Adj PBT" },
  ] as const

  const [filteredConcall, setFilteredConcall] = useState<YearValue | null>(null)
  const [bollingerFormData, setBollingerFormData] =
    useState<IBollingerFormData>(EMPTY_BOLLINGER_FORM)

  // start of bollinger states and functions
  const [visibleKeys, setVisibleKeys] = useState(defaultSelectedKeys)

  const selectedColumns = ALL_COLUMNS.filter((col) =>
    visibleKeys.includes(col.key)
  ).flatMap((col) => {
    const baseRender = (key: any) => (row: any) =>
      row[key] !== undefined ? row[key]?.toFixed?.(2) ?? row[key] : "N/A"

    if (col.key === "calculation_date") {
      return [
        {
          ...col,
          render: (row: any) =>
            row.calculation_date
              ? new Date(row.calculation_date).toLocaleDateString()
              : "N/A",
        },
      ]
    }

    // Generate SMA, Lower Band, and Upper Band versions of each column
    const suffixes = ["_sma", "_lower_band", "_upper_band"]
    return suffixes.map((suffix) => {
      const key = col.key + suffix
      const label = `${col.label || col.key} ${suffix
        .replace("_", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())}`
      return {
        ...col,
        key,
        label,
        render: baseRender(key),
      }
    })
  })

  const handleSelectAll = () => {
    const allKeys = ALL_COLUMNS.filter(
      (col) => col.key !== "calculation_date"
    ).map((col) => col.key)

    const allSelected = allKeys.every((key) => visibleKeys.includes(key))

    // Toggle: If all selected, remove all (except "calculation_date"), else add all
    if (allSelected) {
      setVisibleKeys(["calculation_date"])
    } else {
      setVisibleKeys(["calculation_date", ...allKeys])
    }
  }

  // end of bollinger states and funcs

  useEffect(() => {
    if (!concalls || concalls.length === 0 || concallsLoading) {
      setFilteredConcall(null)
      return
    }

    const quarterOrder = { q1: 1, q2: 2, q3: 3, q4: 4 } as const

    const latest = concalls.reduce((latest, current) => {
      const latestQuarter =
        quarterOrder[latest.quarter_id as keyof typeof quarterOrder]
      const currentQuarter =
        quarterOrder[current.quarter_id as keyof typeof quarterOrder]

      if (current.year_id > latest.year_id) return current
      if (
        current.year_id === latest.year_id &&
        currentQuarter > latestQuarter
      ) {
        return current
      }
      return latest
    }, concalls[0])

    if (latest?.projections?.FY26) {
      setFilteredConcall(latest.projections.FY26)
    } else {
      setFilteredConcall(null)
      console.warn("FY26 data not found in latest projections", latest)
    }
  }, [concalls, concallsLoading])

  const { bollingerBand, loading: bollingerLoading } = useBollingerBands({
    alphaCode: company?.alpha_code ?? "",
    k: Number(bollingerFormData.deviation) || 0,
    windowSize: Number(bollingerFormData.timeFrame as string) || 0,
  })

  const handleBollingerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setBollingerFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="overflow-auto">
        <DialogTitle>Company info</DialogTitle>
        <DialogDescription />
        {company ? (
          <>
            <p className="font-medium">
              {company.alpha_code} | {company.company_name}
            </p>

            <div className="flex flex-row justify-between items-center gap-4">
              {/* Start of left side of the modal */}
              <div className="flex flex-col items-center flex-1">
                {/* Forecast table */}
                {forecast.length > 0 ? (
                  <section className="flex flex-col items-center justify-center w-full">
                    <h3 className="font-semibold mb-2">Quarterly forecast</h3>
                    <CommonTable
                      data={forecast.filter(
                        (f) =>
                          !["profit_after_tax", "profit_before_tax"].includes(
                            f.line_item
                          )
                      )}
                      loading={loading}
                      columns={[
                        {
                          key: "line_item",
                          label: "Line item",
                          render: (f) =>
                            f.line_item
                              .replace(/_/g, " ")
                              .charAt(0)
                              .toUpperCase() +
                            f.line_item.replace(/_/g, " ").slice(1),
                        },
                        {
                          key: "move_back_by",
                          label: "Type",
                          render: (f) =>
                            f.move_back_by === 0
                              ? "YOY"
                              : `Q - ${f.move_back_by}`,
                        },
                        {
                          key: "prediction",
                          label: "Prediction",
                          render: (f) =>
                            !f.prediction
                              ? "No prediction available"
                              : f.prediction.toFixed(2),
                        },
                        {
                          key: "coeff_of_variation",
                          label: "COV",
                          render: (f) =>
                            f.coeff_of_variation === null ||
                            f.coeff_of_variation === undefined
                              ? "No prediction available"
                              : f.coeff_of_variation.toFixed(2),
                        },
                      ]}
                    />
                  </section>
                ) : (
                  "Fetching data.."
                )}

                {/* Splits */}
                {splits && (
                  <section className="mt-6 w-full">
                    <h3 className="font-semibold mb-2">Splits</h3>
                    <CommonTable
                      data={[...SPLIT_KEYS]}
                      columns={[
                        {
                          key: "label",
                          label: "Metric",
                        },
                        ...["Q1", "Q2", "Q3", "Q4"].flatMap((q, i) => [
                          {
                            key: `split_${i}`,
                            label: `${q} Split`,
                            render: (row: any) =>
                              loading
                                ? "Fetching..."
                                : splits?.splits?.[
                                    row.key as keyof typeof splits.splits
                                  ]?.[i]?.toFixed(2) ?? "—",
                          },
                          {
                            key: `vola_${i}`,
                            label: `${q} Volatility`,
                            render: (row: any) =>
                              loading
                                ? "Fetching..."
                                : splits?.splits_volatility?.[
                                    row.key as keyof typeof splits.splits_volatility
                                  ]?.[i]?.toFixed(4) ?? "—",
                          },
                        ]),
                      ]}
                      className="w-full text-xs border text-center"
                    />
                  </section>
                )}
              </div>
              {/* End of left side of the modal  */}

              {/* Start of right side of the modal */}
              <div className="flex flex-col items-start justify-start flex-1 ">
                <span>
                  Market Cap:{" "}
                  {mCapFromGrowwLoading
                    ? "Fetching.."
                    : mCapFromGroww?.toFixed(2) ?? "N/A"}
                </span>
                {concalls && (
                  <section>
                    <h3 className="font-bold">Concalls</h3>
                    {concallsLoading ? (
                      "Fetching concalls data.."
                    ) : (
                      <>
                        <div>
                          {(() => {
                            const ebitda = Number(filteredConcall?.ebitda ?? 0)
                            const interest = Number(
                              filteredConcall?.annualized_interest ?? 0
                            )
                            const depreciation = Number(
                              filteredConcall?.annualized_depreciation ?? 0
                            )
                            const otherIncome = Number(
                              filteredConcall?.other_income ?? 0
                            )
                            const splitValue = Number(
                              splits?.splits?.net_profit?.[0] ?? 0
                            )

                            if (
                              !ebitda ||
                              !interest ||
                              !depreciation ||
                              !otherIncome
                            ) {
                              return (
                                <>
                                  Failed to calculate PBT due to insufficient
                                  values
                                </>
                              )
                            }

                            const pbt =
                              ebitda - interest - depreciation + otherIncome
                            const pbtSplit = pbt * splitValue

                            if (isNaN(pbtSplit)) {
                              return <>Invalid values for PBT x Split</>
                            }

                            return (
                              <div>
                                <div>PBT x Split = {pbtSplit.toFixed(2)}</div>
                              </div>
                            )
                          })()}
                        </div>
                        <div>
                          {filteredConcall?.profit_after_tax == null ||
                          splits?.splits?.net_profit?.[0] == null ? (
                            <>
                              Value not available: PAT ={" "}
                              {filteredConcall?.profit_after_tax ?? "undefined"}
                              , Split ={" "}
                              {splits?.splits?.net_profit?.[0] ?? "undefined"}
                            </>
                          ) : isNaN(Number(filteredConcall.profit_after_tax)) ||
                            isNaN(Number(splits.splits.net_profit[0])) ? (
                            <>
                              Invalid number: PAT ={" "}
                              {filteredConcall.profit_after_tax.toFixed(2)},
                              Split = {splits.splits.net_profit[0]}
                            </>
                          ) : (
                            <>
                              PAT x Split ={" "}
                              {(
                                Number(filteredConcall.profit_after_tax) *
                                Number(splits.splits.net_profit[0])
                              ).toFixed(2)}
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </section>
                )}

                {brokerage && (
                  <section>
                    <h3 className="font-bold">Brokerage</h3>
                    {brokerageLoading ? (
                      "Fetching brokerage data.."
                    ) : (
                      <>
                        <div>
                          {brokerage?.avg_pbt == null ||
                          splits?.splits?.net_profit?.[0] == null ? (
                            <>
                              Value not available: PBT ={" "}
                              {brokerage?.avg_pbt ?? "undefined"}, Split ={" "}
                              {splits?.splits?.net_profit?.[0] ?? "undefined"}
                            </>
                          ) : isNaN(Number(brokerage.avg_pbt)) ||
                            isNaN(Number(splits.splits.net_profit[0])) ? (
                            <>
                              Invalid number: PBT = {brokerage.avg_pbt}, Split ={" "}
                              {splits.splits.net_profit[0]}
                            </>
                          ) : (
                            <>
                              PBT x Split ={" "}
                              {(
                                Number(brokerage.avg_pbt) *
                                Number(splits.splits.net_profit[0])
                              ).toFixed(2)}
                            </>
                          )}
                        </div>
                        <div>
                          {brokerage?.avg_pat == null ||
                          splits?.splits?.net_profit?.[0] == null ? (
                            <>
                              Value not available: PAT ={" "}
                              {brokerage?.avg_pat ?? "undefined"}, Split ={" "}
                              {splits?.splits?.net_profit?.[0] ?? "undefined"}
                            </>
                          ) : isNaN(Number(brokerage.avg_pat)) ||
                            isNaN(Number(splits.splits.net_profit[0])) ? (
                            <>
                              Invalid number: PAT = {brokerage.avg_pat}, Split ={" "}
                              {splits.splits.net_profit[0]}
                            </>
                          ) : (
                            <>
                              PAT x Split ={" "}
                              {(
                                Number(brokerage.avg_pat) *
                                Number(splits.splits.net_profit[0])
                              ).toFixed(2)}
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </section>
                )}

                {/* bollinger starts */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="deviation">Deviation</Label>
                    <Input
                      id="deviation"
                      name="deviation"
                      type="number"
                      value={bollingerFormData.deviation}
                      onChange={handleBollingerInputChange}
                      placeholder="e.g. 1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeFrame">Time Frame</Label>
                    <Input
                      id="timeFrame"
                      name="timeFrame"
                      type="number"
                      value={bollingerFormData.timeFrame}
                      onChange={handleBollingerInputChange}
                      placeholder="e.g. 6"
                    />
                  </div>
                </div>

                {bollingerLoading && (
                  <div className="mt-2 text-sm text-green-600">Loading...</div>
                )}

                {!bollingerLoading && !bollingerBand && (
                  <div className="mt-2 text-sm">
                    No Bollinger data available.
                  </div>
                )}
                {!bollingerLoading && bollingerBand && (
                  <>
                    <div className="mt-6 w-max">
                      <Label>Select Columns to Display</Label>
                      <div className="flex flex-row items-center mt-1 gap-4 max-h-64 overflow-auto border rounded-md p-2">
                        <Button
                          variant="outline"
                          onClick={handleSelectAll}
                          className="text-sm hover:underline self-start"
                        >
                          {ALL_COLUMNS.filter(
                            (col) => col.key !== "calculation_date"
                          ).every((col) => visibleKeys.includes(col.key))
                            ? "Deselect All"
                            : "Select All"}
                        </Button>
                        {ALL_COLUMNS.filter(
                          (col) => col.key !== "calculation_date"
                        ).map((col) => (
                          <label
                            key={col.key}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Checkbox
                              checked={visibleKeys.includes(col.key)}
                              onCheckedChange={() =>
                                setVisibleKeys((prev) =>
                                  prev.includes(col.key)
                                    ? prev.filter((k) => k !== col.key)
                                    : [...prev, col.key]
                                )
                              }
                            />
                            <span className="text-sm">{col.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Unified Table */}
                    <div className="mt-4 w-xl">
                      <h3 className="font-semibold mb-2">
                        Bollinger Band Data
                      </h3>
                      <div className="overflow-auto">
                        <CommonTable
                          data={[bollingerBand]}
                          columns={selectedColumns}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* bollinger ends */}
              </div>
              {/* End of right side of the modal */}
            </div>
          </>
        ) : (
          <p>No company selected.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
