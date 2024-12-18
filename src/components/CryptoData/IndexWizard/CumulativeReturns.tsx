import { Container, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import api from "src/api";

interface CumulativeReturnsProps {
  ticker_list: string[];
}

interface ApiResponse {
  portfolio_cumulative_returns: Record<string, number>[];
  sp500_cum_returns: Record<string, number>[];
  // dowjones_cum_returns: Record<string, number>[];
  btc_cum_returns: Record<string, number>[];
  russell_cum_returns: Record<string, number>[];
}

const CustomTooltip: React.FC<TooltipProps<any, any>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "4px",
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>{`Date: ${payload[0].payload.date}`}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} style={{ margin: 0 }}>
            {`${entry.dataKey}: ${entry.value.toFixed(2)}%`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const CumulativeReturns: React.FC<CumulativeReturnsProps> = ({
  ticker_list,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.post<ApiResponse>("api/iw-returns/", {
        ticker_list: ticker_list,
      });
      const {
        portfolio_cumulative_returns,
        sp500_cum_returns,
        // dowjones_cum_returns,
        btc_cum_returns,
        russell_cum_returns,
      } = response.data;

      // Find the set of all unique dates
      const allDatesSet = new Set<string>();
      portfolio_cumulative_returns.forEach((item) =>
        allDatesSet.add(Object.keys(item)[0])
      );
      sp500_cum_returns.forEach((item) =>
        allDatesSet.add(Object.keys(item)[0])
      );
      // dowjones_cum_returns.forEach((item) =>
      //   allDatesSet.add(Object.keys(item)[0])
      // );
      btc_cum_returns.forEach((item) =>
        allDatesSet.add(Object.keys(item)[0])
      );
      russell_cum_returns.forEach((item) =>
        allDatesSet.add(Object.keys(item)[0])
      );

      const dates = Array.from(allDatesSet).sort();

      // Prepare data for Recharts with interpolation
      const interpolateData = (sourceData: Record<string, number>[]) => {
        const interpolated = dates.map((date) => {
          const entry = sourceData.find((item) => Object.keys(item)[0] === date);
          return {
            date,
            value: entry ? entry[date] : null
          };
        });

        // Interpolate missing values
        let lastValue: number | null = null;
        return interpolated.map((item) => {
          if (item.value !== null) {
            lastValue = item.value;
          } else if (lastValue !== null) {
            item.value = lastValue;
          }
          return item;
        });
      };

      const formattedData = dates.map((date) => ({
        date,
        Portfolio:
          interpolateData(portfolio_cumulative_returns).find(
            (item) => item.date === date
          )?.value || null,
        "S&P 500":
          interpolateData(sp500_cum_returns).find(
            (item) => item.date === date
          )?.value || null,
          // "Dow Jones":
          // interpolateData(dowjones_cum_returns).find(
          //   (item) => item.date === date
          // )?.value || null,
        "BTC-USD":
          interpolateData(btc_cum_returns).find(
            (item) => item.date === date
          )?.value || null,
        "Russell":
          interpolateData(russell_cum_returns).find(
            (item) => item.date === date
          )?.value || null,
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ticker_list]);

  // Formatting functions
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    const options = {
      month: "short",
      year: "2-digit",
    } as Intl.DateTimeFormatOptions;
    return date.toLocaleDateString("en-US", options);
  };

  const formatYAxis = (tickItem: number) => {
    if (tickItem === 0) return "0%";
    if (tickItem < 0) return `${tickItem}%`;
    return `+${tickItem}%`;
  };

  // Calculate tick interval for 12 ticks
  const calculateTickInterval = (dataLength: number) => {
    return Math.ceil(dataLength / 13);
  };

  return (
    <Container sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{  width: '100%', maxWidth: 1200 , marginBottom: '16px', boxShadow: '0 4px 8px 0 #c6f5e4, 0 6px 20px 0 #c6f5e4' }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            color={"#002060"}
            align="center"
            sx={{ mb: 2 }}
          >
            <strong>Cumulative Returns</strong>
          </Typography>
          {loading ? (
           <CircularProgress />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <XAxis
                  dataKey="date"
                  tickFormatter={formatXAxis}
                  interval={calculateTickInterval(data.length)}
                />
                <YAxis tickFormatter={formatYAxis} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Portfolio"
                  stroke="#00A0E1"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="S&P 500"
                  stroke="#39B54A"
                  dot={false}
                />
                {/* <Line
                  type="monotone"
                  dataKey="Dow Jones"
                  stroke="#36a2eb"
                  dot={false}
                /> */}
                <Line
                  type="monotone"
                  dataKey="BTC-USD"
                  stroke="#FF8C00"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Russell"
                  stroke="#FF2B8D"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default CumulativeReturns;
