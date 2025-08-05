export type ConcallRow = {
  quarter_id: string;
  year_id: number;
  guidance_type: string;
  processed: string;
  documents: string;
  total_revenue: number;
  revenue_growth: number;
  ebitda: number;
  ebitda_margin: number;
  profit_after_tax: number;
  is_interest_included: boolean;
  is_other_income_included: boolean;
  annualized_interest: number;
  annualized_depreciation: number;
  other_income: number;
  pbt?: number | null; // optional field
};

export function normalizeConcallProjections(data: any): ConcallRow[] {
  if (!data || !data.data) return [];

  const concalls = data.data.concalls
    .filter((concall: any) => concall.processed === "processed" && concall.projections?.FY26)
    .map((concall: any) => {
      const p = concall.projections.FY26;

      const row: ConcallRow = {
        quarter_id: concall.quarter_id ?? "None",
        year_id: concall.year_id ?? "None",
        guidance_type: concall.guidance_type ?? "None",
        processed: concall.processed ?? "None",
        documents: concall.documents?.map((d: any) => `${d.type_of_concall}: ${d.url}__${d.published_date}`).join("\n") || "None",
        total_revenue: roundTo2Decimals(p.total_revenue) ?? p.total_revenue,
        revenue_growth: roundTo2Decimals(p.revenue_growth) ?? p.revenue_growth,
        ebitda: roundTo2Decimals(p.ebitda) ?? p.ebitda,
        ebitda_margin: roundTo2Decimals(p.ebitda_margin) ?? p.ebitda_margin,
        profit_after_tax: roundTo2Decimals(p.profit_after_tax) ?? p.profit_after_tax,
        is_interest_included: p.is_interest_included ?? false,
        is_other_income_included: p.is_other_income_included ?? false,
        annualized_interest: roundTo2Decimals(p.annualized_interest) ?? p.annualized_interest,
        annualized_depreciation: roundTo2Decimals(p.annualized_depreciation) ?? p.annualized_depreciation,
        other_income: roundTo2Decimals(p.other_income) ?? p.other_income,
      };

      row.pbt = calculateSinglePBT(row);
      return row;
    });

  return concalls;
}


// Helper to calculate PBT for a single row
function calculateSinglePBT(concall: ConcallRow): number | null {
  const {
    ebitda,
    annualized_interest,
    annualized_depreciation,
    other_income,
    is_other_income_included,
  } = concall;

  if (ebitda === null || ebitda === undefined) return null;

  const ebitdaVal = Number(ebitda) || 0;
  const interestVal = Number(annualized_interest) || 0;
  const depreciationVal = Number(annualized_depreciation) || 0;
  const otherIncomeVal = Number(other_income) || 0;

  let pbt = ebitdaVal - interestVal - depreciationVal;

  if (!is_other_income_included) {
    pbt += otherIncomeVal;
  }

  return roundTo2Decimals(pbt) ?? pbt;
}



export type BrokerageRow = {
  avg_revenue_from_operations: number;
  avg_ebitda: number;
  avg_other_income: number;
  avg_pbt: number;
  avg_exceptional_items: string | null;
  avg_tax: number;
  avg_pat: number;
  avg_adj_pat: number;
  avg_earning_multiple: number;
};

export function normalizeBrokerageConsensus(data: any): BrokerageRow[] {
  const b = data.data?.brokerage_consensus?.FY26E;
  if (!b) return [];

  return [{
    avg_revenue_from_operations: roundTo2Decimals(b.avg_revenue_from_operations) ?? b.avg_revenue_from_operations,
    avg_ebitda: roundTo2Decimals(b.avg_ebitda) ?? b.avg_ebitda,
    avg_other_income: roundTo2Decimals(b.avg_other_income) ?? b.avg_other_income,
    avg_pbt: roundTo2Decimals(b.avg_pbt) ?? b.avg_pbt,
    avg_exceptional_items: b.avg_exceptional_items ?? "None",
    avg_tax: roundTo2Decimals(b.avg_tax) ?? b.avg_tax,
    avg_pat: roundTo2Decimals(b.avg_pat) ?? b.avg_pat,
    avg_adj_pat: roundTo2Decimals(b.avg_adj_pat) ?? b.avg_adj_pat,
    avg_earning_multiple: roundTo2Decimals(b.avg_earning_multiple) ?? b.avg_earning_multiple,
  }];
}

function roundTo2Decimals(value: any): any {
  const num = Number(value);
  return isNaN(num) ? value : Number(num.toFixed(2));
}




