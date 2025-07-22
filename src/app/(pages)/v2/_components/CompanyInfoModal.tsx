"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ForecastItem } from "@/hooks/useCompanyData";
import type { Company, SplitsVolatilityData } from "@/types/table.types";

interface Props {
  open: boolean;
  onClose: () => void;
  company: Company | null;
  forecast: ForecastItem[];
  loading: boolean;
  splits: SplitsVolatilityData | null;
  concalls: {
    ebitda: number;
    ebitda_margin: number;
    total_revenue: number;
    revenue_growth: number;
    is_interest_included: boolean;
    is_other_income_included: boolean;
    annualized_interest: number;
    annualized_depreciation: number;
    other_income: number;
    profit_after_tax: number;
  };
  brokerage: {
    avg_revenue?: number;
    avg_ebitda?: number;
    avg_pbt?: number;
    avg_pat?: number;
    avg_adj_pat?: number;
  } | null;
  concallsLoading: boolean;
  brokerageLoading: boolean;
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
}: Props) => {
  const SPLIT_KEYS = [
    { key: "sales", label: "Sales" },
    { key: "operating_profit", label: "Operating Profit" },
    { key: "net_profit", label: "Net Profit" },
  ] as const;

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
              <div className="flex flex-col items-center flex-1">
              {/* Forecast table */}
              {forecast.length > 0 ? (
                <section className="flex flex-col items-center justify-center">
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
                      </tr>
                    </thead>
                    <tbody>
                      {forecast?.map((f, i) => (
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
                                : splits?.splits?.[key]?.[i]?.toFixed(2) ?? "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}
              </div>

              <div className="flex flex-col items-center flex-1">

              {concalls && (
                <section>
                  <div>
                    <div>concalls</div>
                    <label htmlFor="PAT">PAT</label>
                    <p>{concalls.profit_after_tax}</p>
                    <p>{splits?.splits?.net_profit?.[0] ?? 0}</p>
                    <p>
                      {Number(concalls.profit_after_tax) *
                        (splits?.splits?.net_profit?.[0] ?? 0)}
                    </p>
                  </div>
                </section>
              )}

              {brokerage && (
                <section>
                  <div>Brokerage</div>
                  <div>
                    <label htmlFor="PAT">PAT</label>
                    <p>{brokerage.avg_pat}</p>
                    <p>{splits?.splits?.net_profit?.[0] ?? 0}</p>
                    <p>
                      {Number(brokerage.avg_pat) *
                        (splits?.splits?.net_profit?.[0] ?? 0)}
                    </p>
                  </div>
                </section>
              )}
              </div>
            </div>
          </>
        ) : (
          <p>No company selected.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
