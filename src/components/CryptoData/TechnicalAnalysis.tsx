import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useLocation } from "react-router-dom"; // Import useLocation
import CryptoDataFetcher from "../CryptoMain/CryptoDataFetcher";
import api from "src/api";

interface CryptoData {
  company: string;
  security_code: string;
  price: number;
  marketcapitalization: number;
  volume: number;
  marketcapdominance: number;
  circulatingsupply: number;
  maxsupply: number;
}

interface StockNameTicker {
  company: string;
  fs_ticker: string;
}

const TechnicalAnalysis: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] =
    useState<StockNameTicker | null>(null);
  const [tickerData, setTickerData] = useState<CryptoData | null>(null);
  const location = useLocation(); // Use useLocation to get query parameters

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/pages/cryptomonitor/`);
        const fetchedData: CryptoData[] = response.data["crypto_monitor"];
        setCryptoData(fetchedData);
        setLoading(false);

        // Read company name from query parameters
        const queryParams = new URLSearchParams(location.search);
        const companyName = queryParams.get('company');

        if (companyName) {
          const selectedCrypto = fetchedData.find(
            (crypto) => `${crypto.company}` === companyName
          );
          setSelectedCompany({
            company: selectedCrypto?.company || "",
            fs_ticker: `${selectedCrypto?.security_code}-USD` || "",
          });
          setTickerData(selectedCrypto || null);
        } else {
          // Set default data for Bitcoin
          const defaultCrypto = fetchedData.find(
            (crypto: CryptoData) =>
              `${crypto.company} (${crypto.security_code})` === "Bitcoin (BTC)"
          );
          setSelectedCompany({
            company: defaultCrypto?.company || "",
            fs_ticker: `${defaultCrypto?.security_code}-USD` || "",
          });
          setTickerData(defaultCrypto || null);
        }
      } catch (error) {
        console.error("Error fetching the crypto data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [location.search]);

  const handleCompanyChange = (event: any, newValue: string | null) => {
    if (newValue) {
      const selectedCrypto = cryptoData.find(
        (crypto) => `${crypto.company} (${crypto.security_code})` === newValue
      );
      if (selectedCrypto) {
        setSelectedCompany({
          company: selectedCrypto.company,
          fs_ticker: `${selectedCrypto.security_code}-USD`,
        });
        setTickerData(selectedCrypto);
      } else {
        setSelectedCompany(null);
        setTickerData(null);
      }
    } else {
      setSelectedCompany(null);
      setTickerData(null);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: "left" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#002060", fontWeight: "bold" }}
        >
          Technical Analysis
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const options = Array.from(
    new Set(
      cryptoData.map((crypto) => `${crypto.company} (${crypto.security_code})`)
    )
  );

  return (
    <div>
      <Container sx={{ mt: 5, textAlign: "left" }}>
        <Typography
          variant="h4"
          gutterBottom
          fontFamily={"Roboto, sans-serif"}
          sx={{ color: "#002060", fontWeight: "bold" }}
        >
          Technical Analysis
        </Typography>
        <Box mb={3} width={"300px"}>
          <Autocomplete
            options={options}
            getOptionLabel={(option) => option}
            value={`${selectedCompany?.company}`}
            onChange={handleCompanyChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Company"
                variant="outlined"
              />
            )}
          />
        </Box>
        <br />
        <CryptoDataFetcher selectedCompany={selectedCompany} />
      </Container>
    </div>
  );
};

export default TechnicalAnalysis;
