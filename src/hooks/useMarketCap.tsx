import { useEffect, useState } from "react"

interface IMarketCap {
  alpha_code: string
  date: string
  close: number
  market_cap: number
}

export const useMarketCap = (alpha_code?: string) => {
    const [marketCap, setMarketCap] = useState<IMarketCap | null>(null);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (!alpha_code) {
        setMarketCap(null);
        return;
      }
  
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/get-mcap?alpha_code=${alpha_code}`);
          const result = await response.json();
  
          if (result?.success && result?.data?.market_cap !== undefined) {
            setMarketCap(result.data);
          } else {
            console.error("Invalid market cap response:", result);
            setMarketCap(null);
          }
        } catch (error) {
          console.error("Error while fetching mcap", error);
          setMarketCap(null);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [alpha_code]);
  
    return { marketCap, loading };
  };
  