// CryptoDataFetcher.tsx
import React, { useState, useEffect } from "react";
import { CircularProgress, Paper, Grid } from "@mui/material";

import MomentumTable from "../TechnicalAnalysis/MomentumTable";
import MovingAverageTable from "../TechnicalAnalysis/MovingAverageTable";
import TradeTable from "../TechnicalAnalysis/TradeTable";
import VolumeTable from "../TechnicalAnalysis/VolumeTable";
import CompanyDetailsCard from "../TechnicalAnalysis/CompanyDetailsCard";
import PriceChart from "../TechnicalAnalysis/Charts/PriceChart";
import RSIChart from "../TechnicalAnalysis/Charts/RSIChart";
import VolatilityChart from "../TechnicalAnalysis/Charts/VolatilityChart";
import VolumeChart from "../TechnicalAnalysis/Charts/VolumeChart";
import MACDChart from "../TechnicalAnalysis/Charts/MACDChart";
import api from "src/api";


interface StockNameTicker {
  company: string;
  fs_ticker: string;
}

interface CryptoDataFetcherProps {
  selectedCompany: StockNameTicker | null;
}

const CryptoDataFetcher: React.FC<CryptoDataFetcherProps> = ({
  selectedCompany,
}) => {
  const [data, setData] = useState<any>(null); // Adjust type as per your API response structure
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Adjust type as per your error handling

  const fetchData = async (fs_ticker: string) => {
    setLoading(true);
    setError(null);

    const payload = {
      factset_ticker: fs_ticker, // Use selected company's fs_ticker here
    };

    try {
      const response = await api.post(`/pages/cryptoindicators/`, JSON.stringify(payload))
      if (!response) {
        throw new Error(
          `Failed to retrieve data. Status code: ${response}`
        );
      }

      const result = await response.data;
      setData(result);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      fetchData(selectedCompany.fs_ticker);
    }
  }, [selectedCompany]);

  return (
    <div>
      <Grid container spacing={3}>
        {data && <CompanyDetailsCard data={data.ticker_data[0]} />}

        <Grid item xs={12} sm={6} md={4}>
          {loading && <CircularProgress />}
          {error && (
            <Paper style={{ padding: "10px", marginTop: "10px" }}>
              Error: {error}
            </Paper>
          )}

          {data && (
            <>
              <MovingAverageTable data={data} />
              <TradeTable data={data} />
              <VolumeTable data={data} />
              <MomentumTable data={data} />
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          {data && <PriceChart data={data} />}
          {data && <RSIChart data={data.output_rsi[0].data} />}
          {data && <VolatilityChart data={data.output_volatility[0].data} />}
          {data && <VolumeChart data={data} />}
          {data && <MACDChart data={data} />}
        </Grid>
      </Grid>
    </div>
  );
};

export default CryptoDataFetcher;
