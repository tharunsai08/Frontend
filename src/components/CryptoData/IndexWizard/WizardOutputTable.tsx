import React, { useEffect, useState } from "react";
import { Container, CircularProgress, Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
import api from "src/api";

const WizardOutputTable: React.FC<{ ticker_list: string[] | [] }> = ({
  ticker_list,
}) => {
  const [wizardOutputData, setWizardOutputData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  // const navigate = useNavigate(); // Initialize useNavigate hook

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await api.post("/api/returns-table/", {
        "ticker_list": ticker_list,
        required_columns: [
          "Company",
          "Category",
          "Symbol",
          "MarketCapitalization",
          "Price",
          "Return",
          "1_week",
          "1_month",
          "3_months",
          "6_months",
          "1_year",
        ],
      });
      setWizardOutputData(response.data);
    } catch (error) {
      console.error("Error fetching ticker data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchData();
  }, [ticker_list]);

  const formatPercentage = (value: number) => {
    return `${(value).toFixed(2)}%`;
  };

  const formatNumber = (value: number) => {
    return value?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const handleRowClick = (params: any) => {
    // Redirect to the TechnicalAnalysis page with company name as a query parameter
    // navigate(`/technical-analysis?company=${encodeURIComponent(params.row.Company)}`);
    window.open(`/technical-analysis?company=${encodeURIComponent(params.row.Company)}`, '_blank');

  };

  const columns: GridColDef[] = [
    {
      field: "Company",
      headerName: "Company",
      flex: 1,
      headerAlign: "left",
      align: "center",
      renderCell: (params) => (
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => handleRowClick(params)}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "Symbol",
      headerName: "Symbol",
      flex: 1,
      headerAlign: "left",
      align: "center",
    },
    {
      field: "MarketCapitalization",
      headerName: "M Cap ($)",
      flex: 1,
      headerAlign: "left",
      align: "center",
      type: "number",
      renderCell: (params) => formatNumber(params.value),
    },
    {
      field: "Price",
      headerName: "Price ($)",
      flex: 1,
      headerAlign: "left",
      align: "center",
      type: "number",
      renderCell: (params) => params.value?.toLocaleString(), // Format price
    },
    {
      field: "Return",
      headerName: "Return (%)",
      flex: 1,
      headerAlign: "left",
      align: "center",
      type: "number",
      renderCell: (params) => formatPercentage(params.value),
    },
    {
      field: "1_week",
      headerName: "1W Return (%)",
      flex: 1,
      headerAlign: "left",
      align: "center",
      type: "number",
      renderCell: (params) => formatPercentage(params.value),
    },
    {
      field: "1_month",
      headerName: "1M Return (%)",
      flex: 1,
      headerAlign: "left",
      align: "center",
      type: "number",
      renderCell: (params) => formatPercentage(params.value),
    },
    {
      field: "3_months",
      headerName: "3M Return (%)",
      flex: 1,
      headerAlign: "left",
      align: "center",
      type: "number",
      renderCell: (params) => formatPercentage(params.value),
    },
    {
      field: "6_months",
      headerName: "6M Return (%)",
      flex: 1,
      headerAlign: "left",
      align: "center",
      type: "number",
      renderCell: (params) => formatPercentage(params.value),
    },
    {
      field: "1_year",
      headerName: "1Y Return (%)",
      flex: 1,
      headerAlign: "left",
      align: "center",
      type: "number",
      renderCell: (params) => formatPercentage(params.value),
    },
  ];

  return (
    <Container sx={{ mt: 5, textAlign: "left" }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ maxHeight: 500, width: "100%" ,overflow:'auto', "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f0f0f0",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#555",
        },}}>
          <Typography
              variant="h6"
              gutterBottom
              color={"#002060"}
              align="center"
              sx={{ mb: 2 }}
            >
              <strong>Crypto Wizard Summary</strong>
            </Typography>
          <DataGrid
            rows={wizardOutputData.map((data, index) => ({
              id: index, // Provide a unique id for each row
              ...data,
            }))}
            columns={columns}
            autoHeight={false} // Ensure the grid does not automatically adjust height
            rowHeight={35} // Decreased row height
            sx={{
              height: "100%", // Ensure the grid takes the full height of the container
              overflow: "auto", // Allow scrolling
              "& .MuiDataGrid-columnHeaders": {
                color: "#002060", // Match color from CryptoDashboard
                backgroundColor: "#f0f0f0", // Light background similar to CryptoDashboard
                fontWeight: "bold",
                fontSize: "0.8rem",
                textAlign: "center", // Center-align header text
              },
              "& .MuiDataGrid-cell": {
                color: "#000000", // Match color from CryptoDashboard
                fontSize: "0.8rem",
                padding: "4px",
                paddingLeft: '15px',
                textAlign: "left", // Center-align cell text
              },
              "& .MuiDataGrid-row:nth-of-type(even)": { bgcolor: "#F5f5f5" }, // Match color from CryptoDashboard
              "& .MuiDataGrid-row:nth-of-type(odd)": { bgcolor: "#F9F9F9" }, // Match color from CryptoDashboard
              "& .MuiDataGrid-row:hover": { bgcolor: "#E0E0E0" }, // Match hover color from CryptoDashboard
              "& .MuiDataGrid-cell:focus": {
                outline: "none", // Remove outline when cell is focused
              },
            }}
            hideFooter 
          />
        </Box>
      )}
    </Container>
  );
};

export default WizardOutputTable;
