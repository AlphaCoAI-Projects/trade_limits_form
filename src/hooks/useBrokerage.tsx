import { useState, useEffect } from "react";
import { toast } from "sonner"

export const useBrokerage = (alphaCode?: string) => {
  const [brokerage, setBrokerage] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!alphaCode) return;
    setLoading(true);

    const fetchData = async () => {

      try {
        const res = await fetch(`/api/brokerage-consensus?alpha_code=${alphaCode}`)
        const json = await res.json()
        if (json.success) {setBrokerage(json.FY26E)}

        toast.success("Loaded company data");
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData()

  },[alphaCode]);
  return {
    brokerage,
    loading
  };
};
