"use client";

import { useEffect, useState } from "react";
import { CommonTable } from "@/components/gui/Table";
import { useProjections } from "@/hooks/useProjections";
import CompanySelector from "@/components/root/CompanySelector";
import { useCompanySearch } from "@/hooks/useCompanySearch";
import {
  normalizeBrokerageConsensus,
  normalizeConcallProjections,
} from "./_components/NormalizeProjections";
import {SPLIT_KEYS, brokerageColumns, concallColumns} from "@/app/(pages)/projections/_components/ProjectionsKeys"
import { useSplits } from "@/hooks/useSplits";

const Projections = () => {
  const {
    companies,
    open,
    setOpen,
    companyName,
    setCompanyName,
    selectedCompany,
    setSelectedCompany,
    limit,
    setLimit,
    loading: companyLoading,
  } = useCompanySearch();

  const { loading: projectionLoading, projections } = useProjections(
    selectedCompany?.alpha_code
  );

  const [concallData, setConcallData] = useState<any>([]);
  const [brokerageData, setBrokerageData] = useState<any>([]);
  const { splits, loading: splitsLoading } = useSplits(
    selectedCompany?.alpha_code
  );

  useEffect(() => {
    if (!projections) return;

    const concalls = normalizeConcallProjections(projections);
    const brokerage = normalizeBrokerageConsensus(projections);
    setConcallData(concalls);
    setBrokerageData(brokerage);
  }, [projections]);

  return (
    <div className="h-auto my-4 px-4 flex flex-col justify-center items-center w-full">
      <h1 className="text-xl font-semibold mb-4">Projections {selectedCompany?.alpha_code}</h1>

      <CompanySelector
        open={open}
        setOpen={setOpen}
        companyName={companyName}
        setCompanyName={setCompanyName}
        companies={companies}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        limit={limit}
        setLimit={setLimit}
        loading={companyLoading}
      />

      <div className="w-full flex flex-col md:flex-row gap-8 mt-8">
        <div className="w-full md:w-1/2 overflow-auto">
          <h2 className="font-medium mb-2">Concall Projections (FY26)</h2>
          <CommonTable
            loading={projectionLoading}
            data={concallData}
            columns={concallColumns}
            emptyText="No concall projections"
          />
        </div>

        <div className="w-full md:w-1/2 overflow-auto">
          <h2 className="font-medium mb-2">Brokerage Consensus (FY26E)</h2>
          <CommonTable
            loading={projectionLoading}
            data={brokerageData}
            columns={brokerageColumns}
            emptyText="No brokerage data"
          />
        </div>
      </div>

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
              ...["Q1", "Q2", "Q3", "Q4"].map((q, i) => ({
                key: `q${i}`,
                label: q,
                render: (row: any) =>
                  splitsLoading
                    ? "Fetching..."
                    : splits.splits?.[row.key as keyof typeof splits.splits]?.[
                        i
                      ]?.toFixed(2) ?? "—",
              })),
            ]}
            className="w-full text-xs border text-center"
          />
        </section>
      )}
    </div>
  );
};

export default Projections;
