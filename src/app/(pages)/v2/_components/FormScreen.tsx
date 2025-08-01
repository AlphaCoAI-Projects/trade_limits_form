"use client";
import { useMemo, useState } from "react";
import { DateSelector } from "./DateSelector";
import { CompaniesTable } from "./CompaniesTable";
import { CompanyInfoModal } from "./CompanyInfoModal";
import { useUpcomingDates } from "@/hooks/useUpcomingDates";
import { useCompaniesByDate } from "@/hooks/useCompaniesByDate";
import { useCompanyData } from "@/hooks/useCompanyData";
import type { Company } from "@/types/table.types";
import { useLimits } from "@/hooks/useLimits";
import { useConcalls } from "@/hooks/useConcalls";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useVolatility } from "@/hooks/useVolatility";
import { useBollingerBands } from "@/hooks/useBollingerBands";
import { useMarketCap } from "@/hooks/useMarketCap";

export default function FormScreen() {
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedCo, setSelectedCo] = useState<Company | null>(null);

  const { dates, loading: datesLoading } = useUpcomingDates();
  const { companies, loading: compsLoading } = useCompaniesByDate(selectedDate);

  const { limitsMap, loading: limitsLoading } = useLimits(companies);
  const {
    forecast,
    splits,
    loading: detailLoading,
  } = useCompanyData(selectedCo?.alpha_code);

  const { concalls, loading: concallsLoading } = useConcalls(
    selectedCo?.alpha_code
  );
  const { brokerage, loading: brokerageLoading } = useBrokerage(
    selectedCo?.alpha_code
  );
  const { volatility, marketCapitalization, loading: volatilityLoading } = useVolatility(
    selectedCo?.alpha_code
  );

  const {marketCap, loading: marketCapLoading} = useMarketCap(selectedCo?.alpha_code)

  const mCapValue = useMemo(() => marketCap?.market_cap, [marketCap]);

const getFilteredDates = (dates: string[]) => {
  const today = new Date();
  return dates.filter(dateStr => {
    const date = new Date(dateStr);
    const diffDays = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= -4 && diffDays <= 5;
  });
};


  return (
    <main className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-center text-xl font-semibold mt-4">
        Trade‑limits form
      </h1>

      <DateSelector
        dates={getFilteredDates(dates)}
        loading={datesLoading}
        value={selectedDate}
        onChange={(d) => {
          setSelectedDate(d);
          setSelectedCo(null);
        }}
      />

      {compsLoading || limitsLoading ? (
        <p className="text-sm text-muted-foreground">Loading companies…</p>
      ) : (
        <CompaniesTable
          rows={companies}
          onView={setSelectedCo}
          limits={limitsMap}
        />
      )}

      <CompanyInfoModal
        open={!!selectedCo}
        onClose={() => setSelectedCo(null)}
        company={selectedCo}
        forecast={forecast}
        loading={detailLoading}
        splits={splits}
        concalls={concalls}
        concallsLoading={concallsLoading}
        brokerage={brokerage}
        brokerageLoading={brokerageLoading}
        volatility={volatility}
        volatilityLoading={volatilityLoading}
        marketCapitalization={marketCapitalization}
        mCapFromGroww={mCapValue}
        mCapFromGrowwLoading={marketCapLoading}
      />
    </main>
  );
}
