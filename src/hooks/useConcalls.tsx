import { useState, useEffect } from "react";
import { toast } from "sonner"

export const useConcalls = (alphaCode?: string) => {
  const [concalls, setConcalls] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!alphaCode) return;
    setLoading(true);

    const fetchData = async () => {

      try {
        const res = await fetch(`/api/concalls?alpha_code=${alphaCode}`)
        const json = await res.json()
        if (json.success) {setConcalls(json.concalls)}
        
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
    concalls,
    loading
  };
};
