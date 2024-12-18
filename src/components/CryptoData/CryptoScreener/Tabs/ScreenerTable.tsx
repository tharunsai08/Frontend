import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TextField, Button, Grid, Box, Snackbar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./ScreenerTable.css";

import WatchlistPopup from "../../WatchList/WatchlistPopup";
import ExistingWatchlistPopup from "../../WatchList/ExistingWatchlistPopup";
import api from "src/api";
// import ExistingWatchlistPopup from "../../WatchList/ExistingWatchlistPopup";

export interface CryptoData {
  fs_ticker: string;
  price?: number; // Assuming this might be a numeric value
  return_field?: number; // Adjust type as needed
  net_change?: number; // Adjust type as needed
  marketcapdominance?: number; // Adjust type as needed
  marketcapitalization?: number; // Adjust type as needed
  maxsupply?: number; // Adjust type as needed
  totalsupply?: number; // Adjust type as needed
  volume?: number; // Adjust type as needed
  fifty_two_week_high?: number; // Adjust type as needed
  fifty_two_week_low?: number; // Adjust type as needed
  one_month_high?: number; // Adjust type as needed
  one_month_low?: number; // Adjust type as needed
  two_thousand_seventeen_to_date?: number; // Adjust type as needed
  beta_1y?: number; // Adjust type as needed
  business_risk_volatility?: number; // Adjust type as needed
  business_risk_inflation?: number; // Adjust type as needed
  category?: string; // Adjust type as needed
  business_use_category?: string;
  solution_category?: string; // Adjust type as needed
  engagement?: string; // Adjust type as needed
  revenue_scale?: string; // Adjust type as needed
  revenue_growth?: string; // Adjust type as needed
  fees?: string; // Adjust type as needed
  vc_funding?: string; // Adjust type as needed
  transparency?: string; // Adjust type as needed
  team?: string; // Adjust type as needed
  ma9_ma20_value?: string;
  ma20_ma50_value?: string;
  ma50_ma200_value?: string;
  rsi_value?: number;
  cci_value?: number;
  williams_value?: number;
  stochrsi_value?: number;
  stochastics_value?: number;
  macd_value?: number;
  atr_value?: number;
  adx_value?: number;
  super_trend_value?: number;
  mfi_value?: number;
  pvo_value?: number;
  cmf_value?: number;
  moving_average_rating?: string;
  momentum_rating?: string;
  trend_rating?: string;
  volume_rating?: string;
  final_rating?: string;
  ema9?: number;
  ema12?: number;
  ema?: number;
  ema26?: number;
  ema50?: number;
  ema200?: number;
  nine_ma?: number;
  twenty_ma?: number;
  twenty_six_ma?: number;
  fifty_ma?: number;
  hundred_ma?: number;
  two_hundred_ma?: number;
  ytd?: number;
  mtd?: number;
  one_year?: number;
  company: string;
}

interface ScreenerTableProps {
  filters: { [key: string]: string[] };
  data1?: CryptoData[] | [];
  onApply: (filters: { [key: string]: string[] }) => void;
  onReset: () => void;
}

const ScreenerTable: React.FC<ScreenerTableProps> = ({
  filters,
  data1,
  onApply,
  onReset,
}) => {
  const [data, setData] = useState<CryptoData[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [watchlistPopupOpen, setWatchlistPopupOpen] = useState(false);
  const [existingWatchlistPopupOpen, setExistingWatchlistPopupOpen] =
    useState(false);
  const [noSelection, setNoSelection] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState("");
  const [existingWatchlists, setExistingWatchlists] = useState<any[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (data1) {
      setData(data1);
    }
  }, [data1]);

  useEffect(() => {
    api
      .post(`/api/crypto-super-screener-filter/`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fetch existing watchlists from the server
    api
      .get(`/api/get-watchlist-data/`)
      .then((response) => {
        setExistingWatchlists(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching watchlists:", error);
      });
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter((row) => {
    const matchesSearch =
      row.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.fs_ticker.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilters = true;

    Object.keys(filters).forEach((column) => {
      if (filters[column].length > 0) {
        const value =
          row[column.replace(/ /g, "_").toLowerCase() as keyof CryptoData];
        if (!filters[column].includes(`Rating ${value}`)) {
          matchesFilters = false;
        }
      }
    });

    return matchesSearch && matchesFilters;
  });

  const handleWatchlistClick = () => {
    if (selected.length === 0) {
      setNoSelection(true);
    } else {
      setNoSelection(false);
    }
    setWatchlistPopupOpen(true);
  };

  const handleExistingWatchlistClick = () => {
    if (selected.length === 0) {
      setNoSelection(true);
    } else {
      setNoSelection(false);
    }
    setExistingWatchlistPopupOpen(true);
  };

  const handleWatchlistPopupClose = () => {
    setWatchlistPopupOpen(false);
  };

  const handleSaveWatchlist = (name: string) => {
    setWatchlistPopupOpen(false);
  };

  const handleExistingWatchlistPopupClose = () => {
    setExistingWatchlistPopupOpen(false);
  };

  const handleSaveExistingWatchlist = async () => {
    const selectedWatchlistObj = existingWatchlists.find(
      (watchlist) => watchlist.watchlist_name === selectedWatchlist
    );

    if (selectedWatchlistObj) {
      const originalTickerList = selectedWatchlistObj.ticker_list;

      const combinedList = [...originalTickerList, ...selected];
      const updatedTickerList = Array.from(new Set(combinedList));

      try {
        await api.post(`/api/update-watchlist/`, {
          id: selectedWatchlistObj.id,
          ticker_list: updatedTickerList,
        });
      } catch (error) {
        console.error("Error deleting ticker:", error);
      }
    }
    setExistingWatchlistPopupOpen(false);
    setOpenSnackbar(true);
  };
  const handleRowClick = (params: any) => {
    window.open(`/technical-analysis?company=${encodeURIComponent(params.row.company)}`, '_blank');

  };
  const columns: GridColDef[] = [
    {
      field: "fs_ticker",
      headerName: "Company",
      width: 200,
      headerClassName: "headerCell",
      renderCell: (params) => {
        const company = data.find((d) => d.fs_ticker === params.value)?.company || "";
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              height: "100%",
              lineHeight: "2",
              cursor: "pointer",  // Add this line for pointer cursor
            }}
            onClick={(event) => {
              event.stopPropagation(); // Prevent row selection when cell is clicked
              handleRowClick(params);
            }}
          >
            <div
              style={{ fontWeight: "bold", fontSize: "12px", color: "#1390f7" }}
              onClick={(event) => {
                event.stopPropagation(); // Prevent row selection when cell is clicked
                handleRowClick(params);
              }}
            >
              {params.value}
            </div>
            <div
              style={{ fontSize: "11px", color: "#202225" }}
              onClick={(event) => {
                event.stopPropagation(); // Prevent row selection when cell is clicked
                handleRowClick(params);
              }}
            >
              {company}
            </div>
          </div>
        );
      },
    },
    {
      field: "price",
      headerName: "Price ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "return_field",
      headerName: "Return (%)",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params;
        return `${value}%`;
      },
    },
    {
      field: "net_change",
      headerName: "Net Change ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "marketcapdominance",
      headerName: "Market Cap Dominance (%)",
      width: 200,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params;
        return `${value}%`;
      },
    },
    {
      field: "marketcapitalization",
      headerName: "Market Cap (in $ M)",
      width: 180,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params as string | number | undefined;
        if (value !== undefined && value !== null) {
          return value.toString().split(".")[0]; // Convert to string and remove decimals
        }
        return value; // Return the original value if it's undefined or null
      },
    },
    {
      field: "maxsupply",
      headerName: "Max Supply ",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params as string | number | undefined;
        if (value !== undefined && value !== null) {
          return value.toString().split(".")[0]; // Convert to string and remove decimals
        }
        return value; // Return the original value if it's undefined or null
      },
    },
    {
      field: "totalsupply",
      headerName: "Total Supply",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params as string | number | undefined;
        if (value !== undefined && value !== null) {
          return value.toString().split(".")[0]; // Convert to string and remove decimals
        }
        return value; // Return the original value if it's undefined or null
      },
    },
    {
      field: "volume",
      headerName: "Volume",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params as string | number | undefined;
        if (value !== undefined && value !== null) {
          return value.toString().split(".")[0]; // Convert to string and remove decimals
        }
        return value; // Return the original value if it's undefined or null
      },
    },
    {
      field: "fifty_two_week_high",
      headerName: "52 Week High ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "fifty_two_week_low",
      headerName: "52 Week Low ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "one_month_high",
      headerName: "1M High ",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "one_month_low",
      headerName: "1M Low",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "two_thousand_seventeen_to_date",
      headerName: "2017 to Date (%)",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params;
        return `${value}%`;
      },
    },
    {
      field: "beta_1y",
      headerName: "Beta 1Y",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "business_risk_volatility",
      headerName: "Risk Volatility",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params as string | number | undefined;
        if (value !== undefined && value !== null) {
          return value.toString().split(".")[0]; // Convert to string and remove decimals
        }
        return value; // Return the original value if it's undefined or null
      },
    },
    {
      field: "business_risk_inflation",
      headerName: " Risk Inflation",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params as string | number | undefined;
        if (value !== undefined && value !== null) {
          return value.toString().split(".")[0]; // Convert to string and remove decimals
        }
        return value; // Return the original value if it's undefined or null
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "business_use_category",
      headerName: "Business Use Category",
      width: 200,
      headerClassName: "headerCell",
    },
    {
      field: "solution_category",
      headerName: "Solution Category",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "engagement",
      headerName: "Engagement",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params as string | number | undefined;
        if (value !== undefined && value !== null) {
          return value.toString().split(".")[0]; // Convert to string and remove decimals
        }
        return value; // Return the original value if it's undefined or null
      },
    },
    {
      field: "revenue_scale",
      headerName: "Revenue Scale",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params as string | number | undefined;
        if (value !== undefined && value !== null) {
          return value.toString().split(".")[0]; // Convert to string and remove decimals
        }
        return value; // Return the original value if it's undefined or null
      },
    },
    {
      field: "revenue_growth",
      headerName: "Revenue Growth",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params as string | number | undefined;
        if (value !== undefined && value !== null) {
          return value.toString().split(".")[0]; // Convert to string and remove decimals
        }
        return value; // Return the original value if it's undefined or null
      },
    },
    {
      field: "fees",
      headerName: "Fees",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params as string | number | undefined;
        if (value !== undefined && value !== null) {
          return value.toString().split(".")[0]; // Convert to string and remove decimals
        }
        return value; // Return the original value if it's undefined or null
      },
    },
    {
      field: "vc_funding",
      headerName: "VC Funding",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params as string | number | undefined;
        if (value !== undefined && value !== null) {
          return value.toString().split(".")[0]; // Convert to string and remove decimals
        }
        return value; // Return the original value if it's undefined or null
      },
    },
    {
      field: "transparency",
      headerName: "Transparency",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "team",
      headerName: "Team",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "ma9_ma20_value",
      headerName: "MA9-MA20",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "ma20_ma50_value",
      headerName: "MA20-MA50",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "ma50_ma200_value",
      headerName: "MA50-MA200",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "rsi_value",
      headerName: "RSI",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "cci_value",
      headerName: "CCI",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "williams_value",
      headerName: "Williams",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "stochrsi_value",
      headerName: "StochRSI",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "stochastics_value",
      headerName: "Stochastics",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "macd_value",
      headerName: "MACD",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "atr_value",
      headerName: "ATR",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "adx_value",
      headerName: "ADX",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "super_trend_value",
      headerName: "Super Trend",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "mfi_value",
      headerName: "MFI",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "pvo_value",
      headerName: "PVO",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "cmf_value",
      headerName: "CMF",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "moving_average_rating",
      headerName: "MA Rating",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "momentum_rating",
      headerName: "Momentum Rating",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "trend_rating",
      headerName: "Trend Rating",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "volume_rating",
      headerName: "Volume Rating",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "final_rating",
      headerName: "Final Rating",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "ema9",
      headerName: "EMA9 ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "ema12",
      headerName: "EMA12 ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "ema",
      headerName: "EMA ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "ema26",
      headerName: "EMA26 ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "ema50",
      headerName: "EMA50 ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "ema200",
      headerName: "EMA200 ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "nine_ma",
      headerName: "9MA ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "twenty_ma",
      headerName: "20MA ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "twenty_six_ma",
      headerName: "26MA ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "fifty_ma",
      headerName: "50MA ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "hundred_ma",
      headerName: "100MA ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "two_hundred_ma",
      headerName: "200MA ($)",
      width: 150,
      headerClassName: "headerCell",
    },
    {
      field: "ytd",
      headerName: "YTD (%)",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params;
        return `${value}%`;
      },
    },
    {
      field: "mtd",
      headerName: "MTD (%)",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params;
        return `${value}%`;
      },
    },
    {
      field: "one_year",
      headerName: "1Y (%)",
      width: 150,
      headerClassName: "headerCell",
      valueFormatter: (params) => {
        const value = params;
        return `${value}%`;
      },
    },
  ];

  const getRowClassName = (params: any) => {
    return params.rowIndex % 2 === 0 ? "evenRow" : "oddRow";
  };

  return (
    <div>
      <Box sx={{ marginBottom: "25px" }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              sx={{ ml: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <span>
              List of coins:{" "}
              <span style={{ color: "#6A2500", fontWeight: "bold" }}>
                {" "}
                {data.length}
              </span>{" "}
              | Selected coins:{" "}
              <span style={{ color: "#6A2500", fontWeight: "bold" }}>
                {" "}
                {selected.length}
              </span>
            </span>
          </Grid>
          <Grid item xs={12} sm={4} textAlign="right">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              style={{ color: "#FFFFFF",backgroundColor:'#002060', marginLeft: "16px" }}
              onClick={handleWatchlistClick}
            >
              Watchlist
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              style={{
                border: "1px solid #002060",
                marginLeft: "16px",
                backgroundColor: "#FFFFFF",
                color: "#002060",
              }}
              onClick={handleExistingWatchlistClick}
            >
              Existing WL
            </Button>
          </Grid>
        </Grid>
      </Box>
      <div style={{ height: 600, width: "100%", overflow: "auto" }}>
      <DataGrid
  rows={filteredData}
  columns={columns}
  loading={loading}
  checkboxSelection
  onRowSelectionModelChange={(newSelection) =>
    setSelected(newSelection as string[])
  }
  getRowId={(row) => row.fs_ticker}
  getRowClassName={getRowClassName}
  sx={{
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "transparent",
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
      backgroundColor: "#F5F5F5",
    },
    "& .Mui-checked": {
      color: "#002060 !important", // Change checkbox color when checked
    },
    "& .MuiCheckbox-root": {
      color: "#002060", // Change default checkbox color
    },
  
  }}
/>

      </div>
      <WatchlistPopup
        open={watchlistPopupOpen}
        onClose={handleWatchlistPopupClose}
        onSave={handleSaveWatchlist}
        noSelection={noSelection}
        selectedTickers={selected}
      />

      <ExistingWatchlistPopup
        open={existingWatchlistPopupOpen}
        onClose={handleExistingWatchlistPopupClose}
        onSave={handleSaveExistingWatchlist}
        noSelection={noSelection}
        existingWatchlists={existingWatchlists}
        selectedWatchlist={selectedWatchlist}
        setSelectedWatchlist={setSelectedWatchlist}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        message="Added to existing watchlist Sucessfully."
        color="blue"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      />
    </div>
  );
};

export default ScreenerTable;
