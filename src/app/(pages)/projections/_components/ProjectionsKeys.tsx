export const concallColumns = [
  { key: "quarter_id", label: "Quarter" },
  { key: "year_id", label: "Year" },
  { key: "guidance_type", label: "Guidance Type" },
  { key: "processed", label: "Processed" },
  { key: "profit_after_tax", label: "PAT" },
  { key: "pbt", label: "PBT" },
  { key: "total_revenue", label: "Total Revenue" },
  { key: "revenue_growth", label: "Revenue Growth (%)" },
  { key: "ebitda", label: "EBITDA" },
  { key: "ebitda_margin", label: "EBITDA Margin (%)" },
  { key: "annualized_depreciation", label: "Depreciation" },
  {
    key: "is_interest_included",
    label: "Interest Included",
    render: (row: any) =>
      row.is_interest_included === true
        ? "Yes"
        : row.is_interest_included === false
        ? "No"
        : "-",
  },
  {
    key: "is_other_income_included",
    label: "Other Income Included",
    render: (row: any) =>
      row.is_other_income_included === true
        ? "Yes"
        : row.is_other_income_included === false
        ? "No"
        : "-",
  },
  { key: "annualized_interest", label: "Annualized Interest" },
  { key: "other_income", label: "Other Income" },
  {
    key: "documents",
    label: "Documents",
    render: (row: any) => (
      <div className="flex flex-col">
        {row.documents.split("\n").map((doc: string, i: number) => {
          const [type, full_url] = doc.split(": ");
          const [url, date] = full_url.split("__");
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              className="text-blue-600 text-xs underline"
            >
              {type} <span className="text-black text-[8px]">{date.split("T")[0]}</span>
            </a>
          );
        })}
      </div>
    ),
  },
];

export const brokerageColumns = [
  { key: "avg_pat", label: "Avg PAT" },
  { key: "avg_pbt", label: "Avg PBT" },
  { key: "avg_ebitda", label: "Avg EBITDA" },
  { key: "avg_revenue_from_operations", label: "Avg Revenue from Ops" },
  { key: "avg_other_income", label: "Avg Other Income" },
  { key: "avg_exceptional_items", label: "Avg Exceptional Items" },
  { key: "avg_tax", label: "Avg Tax" },
  { key: "avg_adj_pat", label: "Avg Adj. PAT" },
  { key: "avg_earning_multiple", label: "Avg Earnings Multiple" },
];

export const SPLIT_KEYS = [
  { key: "sales", label: "Sales" },
  { key: "operating_profit", label: "Operating Profit" },
  { key: "net_profit", label: "Net Profit" },
  { key: "adjusted_pbt", label: "Adjusted PBT" },
] as const;