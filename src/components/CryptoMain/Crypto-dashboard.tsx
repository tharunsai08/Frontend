import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import api from "src/api";

interface CryptoData {
  company: string;
  security_code: string;
  price: number;
  marketcapitalization: number;
  volume: number;
  marketcapdominance: number;
  circulatingsupply: number;
  maxsupply: number | null;
}

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

const formatNumberWithoutDecimals = (value: number): string => {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
};

const formatVolume = (value: number): string => {
  if (value < 1) {
    return value.toExponential(2).replace("e", "e");
  } else {
    return value.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }
};

const CryptoDashboard: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/pages/cryptomonitor/`);
        const dataWithId = response.data["crypto_monitor"].map(
          (item: CryptoData) => ({
            ...item,
            id: item.security_code, // Use security_code as the unique identifier
          })
        );
        setCryptoData(dataWithId);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the crypto data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = cryptoData.filter(
    (crypto) =>
      crypto.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.security_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: "left" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#002060", fontWeight: "bold" }}
        >
          Cryptocurrency Dashboard
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

  const columns: GridColDef[] = [
    { field: "company", headerName: "Company", width: 150 },
    { field: "security_code", headerName: "Ticker", width: 120 },
    {
      field: "price",
      headerName: "Price ($)",
      width: 120,
      valueFormatter: (params) => formatNumber(params as number),
    },
    {
      field: "marketcapitalization",
      headerName: "Market Cap (in $ M)",
      width: 150,
      valueFormatter: (params) => formatNumberWithoutDecimals(params as number),
    },
    {
      field: "volume",
      headerName: "Volume (in M)",
      width: 120,
      valueFormatter: (params) => formatVolume(params as number),
    },
    {
      field: "marketcapdominance",
      headerName: "MCap Dominance (%)",
      width: 180,
      valueFormatter: (params) => {
        const value = params as number;
        return `${value.toFixed(2)}%`;
      },
    },
    {
      field: "circulatingsupply",
      headerName: "Circulating Supply",
      width: 140,
      valueFormatter: (params) => formatNumberWithoutDecimals(params as number),
    },
    {
      field: "maxsupply",
      headerName: "Max Supply",
      width: 150,
      valueFormatter: (params) => {
        const value = params;
        return value && !isNaN(Number(value))
          ? Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })
          : value;
      },
    },
  ];

  return (
    <Container sx={{ mt: 5, textAlign: "left" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography
          variant="h4"
          gutterBottom
          fontFamily={"Roboto, sans-serif"}
          sx={{ color: "#002060", fontWeight: "bold" }}
        >
          Cryptocurrency Dashboard
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          sx={{ ml: 2 }}
        />
      </Box>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
          getRowId={(row) => row.security_code} // Specify how to get the unique id
          rowHeight={35} // Decrease the row height here
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              color: "#002060",
              backgroundColor: "transparent", // Remove background color
            },
            "& .MuiDataGrid-cell": {
              color: "#000000",
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
        />
      </Box>
    </Container>
  );
};

export default CryptoDashboard;
