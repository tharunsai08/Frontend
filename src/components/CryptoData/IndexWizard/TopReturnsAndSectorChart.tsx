import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem,
} from "chart.js";
import {
  CircularProgress,
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import api from "src/api";

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

type TopReturn = {
  Company: string;
  InvestmentAmount: number;
  ReturnPercentage: number;
  // ReturnValue: number;
  CurrentValue: number;
  SecurityCode: string;
  CompanySector: string;
};

type SectorWiseData = {
  name: string;
  percentage: number;
};

const TopReturnsAndSectorChart: React.FC<{ ticker_list: string[], prices_list: number[] | [], quantity_list: number[] | [] }> = ({
  ticker_list, prices_list, quantity_list
}) => {
  const [data, setData] = useState<{
    topReturns: TopReturn[];
    sectorWise: SectorWiseData[];
  }>({
    topReturns: [],
    sectorWise: [],
  });

  const [loading, setLoading] = useState<boolean>(true);
  const heading = ticker_list.length > 10 ? 'Top 10 Holdings' : 'Top Holdings';

  const fetchDataForStep = async () => {
    setLoading(true);
    try {
      const response = await api.post("api/top-returns/", {
        ticker_list: ticker_list,
        prices_list: prices_list,
        quantity_list: quantity_list
      }); 
      const { top_returns, sector_wise } = response.data;

      // Map API response to fit TopReturn and SectorWiseData types
      setData({
        topReturns: top_returns.map((item: any) => ({
          Company: item.Company,
          InvestmentAmount: item["Investment Amount"],
          ReturnPercentage: item["Return_percentage"],
          // ReturnValue: item["Return_value"],
          CurrentValue: item['Current_Value'],
          SecurityCode: item["Security_Code"],
          CompanySector: item["company_sector"]
        })),
        sectorWise: sector_wise,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataForStep();
  }, [ticker_list]);

  const formatPercentage = (value: number) => {
    return `${(value).toFixed(2)}%`;
  };

  const columns: GridColDef[] = [
    { field: "Company", headerName: "Company", width: 130 },
    { field: "SecurityCode", headerName: "Security Code", width: 100 },
    { field: "company_sector", headerName: "Sector", width: 120 },
    { field: "InvestmentAmount", headerName: "Investment Amount ($)", width: 120 ,renderCell: (params) => params.value?.toLocaleString()    },
    // { field: "ReturnValue", headerName: "Return Value", width: 100 ,renderCell: (params) => params.value?.toLocaleString()  },
    { field: "CurrentValue", headerName: "Current Value", width: 100 ,renderCell: (params) => params.value?.toLocaleString()  },
    { field: "ReturnPercentage", headerName: "Return 1Y (%)", width: 100 , renderCell: (params) => formatPercentage(params.value)},

  ];

  const rows = data.topReturns.map((item, index) => ({
    id: index,
    Company: item.Company,
    InvestmentAmount: item.InvestmentAmount,
    ReturnPercentage: item.ReturnPercentage,
    // ReturnValue: item.ReturnValue ,
    CurrentValue: item.CurrentValue,
    SecurityCode: item.SecurityCode,
    company_sector: item.CompanySector,
  }));

  const pieData: ChartData<"pie"> = {
    labels: data.sectorWise.map((sector) => sector.name),
    datasets: [
      {
        label: 'Portfolio Investment Amount By Sector',
        data: data.sectorWise.map((sector) => sector.percentage),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const pieOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true, // 1. Enables circle style for legend items
          pointStyle: "circle", // 2. Set the point style to circle
          boxWidth: 10, // 3. Decrease circle width in legend
          boxHeight: 10, // 4. Decrease circle height in legend
          padding: 10, // 5. Adjust padding around the legend items
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: TooltipItem<"pie">) {
            const value = tooltipItem.raw as number;
            const percentage = (value).toFixed(1);
            return `Invested Amount(%): ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <Container sx={{ mt: 5 }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "500px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Left side - DataGrid */}
          <Grid item xs={12} md={8} sx={{ p: 1 }}>
            <Card elevation={3} sx={{ height: "400px" }}>
              <CardContent>
              <Typography
            variant="h6"
            gutterBottom
            color={"#002060"}
            align="center"
            sx={{ mb: 2 }}
          >
            <strong>{heading}</strong>
          </Typography>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  rowHeight={35}     
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      color: "#610111",
                      backgroundColor: "transparent", // Remove background color
                    },
                    "& .MuiDataGrid-cell": {
                      color: "#000000",
                      fontSize: '0.7rem'
                    },
                    "& .MuiDataGrid-cell--editing": {
                      border: "none",
                    },
                    "& .MuiDataGrid-cell:focus": {
                      outline: "none",
                    },
                    "& .MuiDataGrid-row:nth-of-type(odd)": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                  hideFooter 
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Right side - Pie Chart */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: "400px" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color={'#002060'}>
                  <strong>Investment Amount By Sector</strong>
                </Typography>
                <div style={{ height: "100%", width: "100%" }}>
                  <Pie
                    options={pieOptions}
                    data={pieData}
                    // Use the options for responsive behavior
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default TopReturnsAndSectorChart;
