import React, { useEffect, useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";

import api from "src/api";

interface CryptoData {
  name: string;
  lineWidth: number;
  color: string;
  data: [string, number][];
}

const CryptoTopCharts: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [cryptoInfo, setCryptoInfo] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `/pages/cryptomonitor/`,
        );
        console.log("API Response:", response.data);

        if (response.data && response.data.indices_lines) {
          const processedData = processCryptoData(response.data.indices_lines);
          setData(processedData.data);
          setCryptoInfo(processedData.info);
        } else {
          console.error("Invalid API response structure:", response.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processCryptoData = (cryptoData: CryptoData[]) => {
    const dates = Array.from(
      new Set(
        cryptoData.reduce(
          (acc, item) => acc.concat(item.data.map((d) => d[0])),
          [] as string[]
        )
      )
    ).sort();

    const processedData = dates.map((date) => {
      const entry: any = { date };
      cryptoData.forEach((crypto) => {
        const cryptoDataOnDate = crypto.data.find((d) => d[0] === date);
        entry[crypto.name] = cryptoDataOnDate ? cryptoDataOnDate[1] : null;
      });
      return entry;
    });

    return { data: processedData, info: cryptoData };
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: "left" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#002060", fontWeight: "bold" }}
        >
          Top Crypto Currencies
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

  return (
    <Container sx={{ mt: 5, textAlign: "left" }}>
      <Typography variant="h5" sx={{ color: "#002060", mb: 2 }}>
        <strong>Top Crypto Currencies</strong>
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {cryptoInfo.map((crypto, index) => (
          <Card key={index} sx={{ width: "calc(50% - 10px)" }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ color: "#002060", mb: 2 }}>
                {crypto.name}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }} // Decrease X-axis tick font size
                    tickFormatter={(value: string) => {
                      const date = new Date(value);
                      return `${date.toLocaleString("default", {
                        month: "short",
                      })} ${date.getDate()}`;
                    }}
                  />
                  <YAxis
                    tickFormatter={(value: number) => formatYAxis(value)} // Format Y-axis ticks
                  />
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />                  <Legend />
                  <Area
                    type="monotone"
                    dataKey={crypto.name}
                    stroke={crypto.color}
                    fill={crypto.color}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default CryptoTopCharts;
