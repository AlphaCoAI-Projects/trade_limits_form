import { useState, useEffect } from "react";
import { toast } from "sonner"

interface CompanyList {
  date: string;
  list: {
    alpha_code: string;
    company_name: string;
  }[];
}

export const useDateDropdown = () => {
  const [dateItem, setDateItem] = useState<string>();
  const [companiesList, setCompaniesList] = useState<CompanyList>();

  useEffect(() => {
    if (!dateItem) return;

    const fetchCompanies = async () => {
      try {
        const res = await fetch(`/api/company-name?q=${encodeURIComponent(dateItem)}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Unknown error");
        }

        setCompaniesList(data.data);
      } catch (err: any) {
        console.error("Company search error:", err);
        toast.error(`Error fetching company data: ${err.message}`);
        setCompaniesList(undefined);
      }
    };

    fetchCompanies();
  }, [dateItem]);

  return {
    dateItem,
    setDateItem,
    companiesList,
  };
};
