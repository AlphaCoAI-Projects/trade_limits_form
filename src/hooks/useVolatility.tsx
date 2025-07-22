import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface SplitsVolatilityData {
  splits: {
    sales?: number[];
    operating_profit?: number[];
    net_profit?: number[];
  };
  volatility: {
    sales?: number;
    operating_profit?: number;
    adjusted_pbt?: number;
    adjusted_pat?: number;
  };
}

export const useVolatility = (alphaCode?: string) => {
  const [volatility, setVolatility] = useState<any>(null);
  const [marketCapitalization, setMarketCapitalization] = useState<undefined | number>(0)
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!alphaCode) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/splits-volatility?alpha_code=${alphaCode}`
        );
        const json = await res.json();
        if (json.success) {
          setMarketCapitalization(json.data.market_capitalization)
          setVolatility(json.data.volatility);
        }
        
        toast.success("Loaded company data");
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [alphaCode]);
  return {
    marketCapitalization,
    volatility,
    loading
  };
};
