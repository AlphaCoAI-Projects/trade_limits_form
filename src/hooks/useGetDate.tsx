import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useGetDate = () => {
  const [dates, setDates] = useState<string[]>();

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await fetch(`/api/company-dates`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch dates");
        }

        setDates(data.data);
      } catch (err: any) {
        console.error("Date fetch error:", err);
        toast.error(`Error fetching date list: ${err.message}`);
        setDates(undefined);
      }
    };

    fetchDates();
  }, []);

  return {
    dates,
  };
};
