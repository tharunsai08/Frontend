import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";

import api from "src/api";

interface TimePeriodSelectorProps {
  timePeriod: string;
  setTimePeriod: (value: string) => void;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  timePeriod,
  setTimePeriod,
}) => (
  <FormControl variant="outlined" sx={{ minWidth: 120 }}>
    <InputLabel id="time-period-select-label">Time Period</InputLabel>
    <Select
      labelId="time-period-select-label"
      id="time-period-select"
      value={timePeriod}
      onChange={(e) => setTimePeriod(e.target.value as string)}
      label="Time Period"
      sx={{ fontSize: "0.725rem", height: "40px" }}
    >
      <MenuItem value="1day">1 Day</MenuItem>
      <MenuItem value="1week">1 Week</MenuItem>
      <MenuItem value="1month">1 Month</MenuItem>
      <MenuItem value="1year">1 Year</MenuItem>
    </Select>
  </FormControl>
);

const formatNumber = (value: number): string => {
  if (value < 1) {
    return value.toExponential(2).replace("e", "e");
  } else {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};

interface GainersLosersTableProps {
  title: string;
  data: {
    company: string;
    fs_ticker: string;
    start_price: number;
    end_price: number;
    return_value: number;
  }[];
  headerColor: string;
}

const GainersLosersTable: React.FC<GainersLosersTableProps> = ({
  title,
  data,
  headerColor,
}) => (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: headerColor }}>
          <TableRow>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "0.725rem",
                width: "30%",
              }}
            >
              Company
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "0.725rem",
                width: "22%",
              }}
            >
              Ticker
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "0.725rem",
                width: "17%",
              }}
            >
              Start Price
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "0.725rem",
                width: "16%",
              }}
            >
              End Price
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "0.725rem",
                width: "15%",
              }}
            >
              Return{" "}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.fs_ticker}
              sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" } }}
            >
              <TableCell
                sx={{
                  color: "#0078ff",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  width: "30%",
                }}
              >
                {item.company}
              </TableCell>
              <TableCell sx={{ fontSize: "0.7rem", width: "20%" }}>
                {item.fs_ticker}
              </TableCell>
              <TableCell sx={{ fontSize: "0.7rem", width: "17%" }}>
                ${formatNumber(item.start_price)}
              </TableCell>
              <TableCell sx={{ fontSize: "0.7rem", width: "18%" }}>
                ${formatNumber(item.end_price)}
              </TableCell>
              <TableCell sx={{ fontSize: "0.7rem", width: "16%" }}>
                {item.return_value.toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

interface CryptoData {
  top_gainers: {
    company: string;
    fs_ticker: string;
    start_price: number;
    end_price: number;
    return_value: number;
  }[];
  top_losers: {
    company: string;
    fs_ticker: string;
    start_price: number;
    end_price: number;
    return_value: number;
  }[];
}

const CryptoGainersLosers: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<string>("1day");
  const [data, setData] = useState<CryptoData>({
    top_gainers: [],
    top_losers: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/crypto-prices/${timePeriod}/`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [timePeriod]);

  if (loading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography
            variant="h5"
            fontFamily={"Roboto, sans-serif"}
            sx={{ color: "#002060", fontWeight: "bold" }}
          >
            Top Gainers and Losers
          </Typography>
          <TimePeriodSelector
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
          />
        </Box>
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

  return (
    <Container sx={{ mt: 5, textAlign: "left" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h5" sx={{ color: "#002060", fontWeight: "bold" }}>
          Top Gainers and Losers
        </Typography>
        <TimePeriodSelector
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={6}>
          <GainersLosersTable
            title="Top Gainers"
            data={data.top_gainers}
            headerColor="#008561"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <GainersLosersTable
            title="Top Losers"
            data={data.top_losers}
            headerColor="#e2010e"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CryptoGainersLosers;
