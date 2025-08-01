"use client"
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
import type { Company, SplitsVolatilityData } from "@/types/table.types"
import { useEffect, useState } from "react"

interface Concalls {
  year_id: number
  quarter_id: string
  processed: string
  projections: {
    [fy: string]: YearValue
  }
}

interface YearValue {
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

interface IBollingerFormData {
  deviation: number | string
  timeFrame: number | string
}

const EMPTY_BOLLINGER_FORM: IBollingerFormData = {
  deviation: "",
  timeFrame: "",
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
  const SPLIT_KEYS = [
    { key: "sales", label: "Sales" },
    { key: "operating_profit", label: "Operating Profit" },
    { key: "net_profit", label: "Net Profit" },
  ] as const

  const [filteredConcall, setFilteredConcall] = useState<YearValue | null>(null)
  const [bollingerFormData, setBollingerFormData] =
    useState<IBollingerFormData>(EMPTY_BOLLINGER_FORM)

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
                    <table className="w-full text-sm border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="border px-2 py-1 text-left">
                            Line item
                          </th>
                          <th className="border px-2 py-1 text-left">Type</th>
                          <th className="border px-2 py-1 text-left">
                            Prediction
                          </th>
                          <th className="border px-2 py-1 text-left">
                            Volatility
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {forecast
                          ?.filter(
                            (f) =>
                              ![
                                "profit_after_tax",
                                "profit_before_tax",
                              ].includes(f.line_item)
                          )
                          .map((f, i) => (
                            <tr key={i}>
                              <td className="border px-2 py-1 capitalize">
                                {f.line_item.replace(/_/g, " ")}
                              </td>
                              <td className="border px-2 py-1">
                                {f.move_back_by === 0 ? "YOY" : "Q ‑ 1"}
                              </td>
                              <td className="border px-2 py-1 font-medium">
                                {loading
                                  ? "Fetching.."
                                  : !f?.prediction
                                  ? "No prediction available"
                                  : f?.prediction?.toFixed(2)}
                              </td>
                              <td className="border px-2 py-1 font-medium">
                                {volatility?.[
                                  f.line_item as keyof typeof volatility
                                ]?.toFixed(2) ?? "N/A"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </section>
                ) : (
                  "Fetching data.."
                )}

                {/* Splits */}
                {splits && (
                  <section className="mt-6 w-full">
                    <h3 className="font-semibold mb-2">Splits</h3>
                    <table className="w-full text-xs border text-center">
                      <thead className="bg-muted">
                        <tr>
                          <th className="border px-2 py-1 text-left">Metric</th>
                          {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                            <th key={q} className="border px-2 py-1">
                              {q}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {SPLIT_KEYS.map(({ key, label }) => (
                          <tr key={key}>
                            <td className="border px-2 py-1 text-left">
                              {label}
                            </td>
                            {[0, 1, 2, 3].map((i) => (
                              <td key={i} className="border px-2 py-1">
                                {loading
                                  ? "Fetching..."
                                  : splits?.splits?.[key]?.[i]?.toFixed(2) ??
                                    "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                )}
              </div>
              {/* End of left side of the modal  */}

              {/* Start of right side of the modal */}
              <div className="flex flex-col items-start justify-start flex-1">
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

                {bollingerBand && (
                  <div className="w-full mt-4">
                    <h3 className="font-semibold mb-2">
                      Latest Bollinger Band
                    </h3>

                    {/* Main Table with Core Metrics */}
                    <table className="w-full text-sm border text-left">
                      <thead className="bg-muted">
                        <tr>
                          <th className="border px-2 py-1">Alpha Code</th>
                          <th className="border px-2 py-1">Date</th>
                          <th className="border px-2 py-1">SMA</th>
                          <th className="border px-2 py-1">Upper Band</th>
                          <th className="border px-2 py-1">Lower Band</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-2 py-1">
                            {bollingerBand.alpha_code}
                          </td>
                          <td className="border px-2 py-1">
                            {new Date(
                              bollingerBand?.calculation_date
                            ).toLocaleDateString() ?? "N/A"}
                          </td>
                          <td className="border px-2 py-1">
                            {bollingerBand?.pricesales_sma?.toFixed(2) ?? "N/A"}
                          </td>
                          <td className="border px-2 py-1">
                            {bollingerBand?.pricesales_upper_band?.toFixed(2) ??
                              "N/A"}
                          </td>
                          <td className="border px-2 py-1">
                            {bollingerBand?.pricesales_lower_band?.toFixed(2) ??
                              "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Adj PBT Related Data */}
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">
                        Adjusted PBT Metrics
                      </h4>
                      <table className="w-full text-sm border text-left">
                        <thead className="bg-muted">
                          <tr>
                            <th className="border px-2 py-1">Adj PBT SMA</th>
                            <th className="border px-2 py-1">Upper Band</th>
                            <th className="border px-2 py-1">Lower Band</th>
                            <th className="border px-2 py-1">COV</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border px-2 py-1">
                              {bollingerBand?.adj_pbt_to_e_sma?.toFixed(2) ??
                                "N/A"}
                            </td>
                            <td className="border px-2 py-1">
                              {bollingerBand?.adj_pbt_to_e_upper_band?.toFixed(
                                2
                              ) ?? "N/A"}
                            </td>
                            <td className="border px-2 py-1">
                              {bollingerBand?.adj_pbt_to_e_lower_band?.toFixed(
                                2
                              ) ?? "N/A"}
                            </td>
                            <td className="border px-2 py-1">
                              {bollingerBand?.adj_pbt_to_e_cov?.toFixed(2) ??
                                "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
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
