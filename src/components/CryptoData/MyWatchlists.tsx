import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  MenuItem,
  FormControl,
  Select as MUISelect,
  InputLabel,
  SelectChangeEvent,
  Box,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../AuthContext";

import NewsList from "../CryptoDailyData/CryptoNews/NewsList";
import api from "src/api";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
} from "@mui/x-data-grid";

const MyWatchlists = () => {
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState("");
  const [watchlistData, setWatchlistData] = useState<GridRowsProp>([]);
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [message, setMessage] = useState("News Related to your Watchlist");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/api/get-watchlist-data/`)
      .then((response) => {
        setWatchlists(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching watchlists:", error);
      });
  }, [token]);

  const handleCreateWatchlist = () => {
    navigate("/screener");
  };

  const handleWatchlistChange = (event: SelectChangeEvent<string>) => {
    const selected = event.target.value;
    setSelectedWatchlist(selected);

    const selectedWatchlistObj = watchlists.find(
      (watchlist) => watchlist.watchlist_name === selected
    );

    if (selectedWatchlistObj) {
      const tickerList = selectedWatchlistObj.ticker_list;

      const baseTickers = tickerList.map((ticker: string) => {
        return ticker.split("-")[0]; // Extract base ticker before '-'
      });
      const updatedTickers = ["General", ...baseTickers];
      if (updatedTickers.length < 2) {
        setMessage("No News Related to your Watchlist, General news are");
      }

      setFilters({ ticker_list: updatedTickers });

      // Fetch tickers list for the selected watchlist
      const fetchTickers = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await api.post(
            `/api/crypto-super-screener-filter/`,
            {
              "ticker-list": tickerList,
              required_columns: [
                "company",
                "fs_ticker",
                "price",
                "return_field",
                "fifty_two_week_high",
                "fifty_two_week_low",
                "mtd",
                "one_year",
                "ytd",
              ],
            }
          );

          setWatchlistData(response.data || []);
        } catch (error) {
          setError("Error fetching ticker data. Please try again later.");
          console.error("Error fetching ticker data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTickers();
    }
  };

  const handleDeleteTicker = async (tickerSymbol: string) => {
    const selectedWatchlistObj = watchlists.find(
      (watchlist) => watchlist.watchlist_name === selectedWatchlist
    );

    if (selectedWatchlistObj) {
      const originalTickerList = selectedWatchlistObj.ticker_list;

      const updatedTickerList = originalTickerList.filter(
        (t: string) => t !== tickerSymbol
      );

      try {
        await api.post(`/api/update-watchlist/`, {
          id: selectedWatchlistObj.id,
          ticker_list: updatedTickerList,
        });

        setWatchlists((prevWatchlists) =>
          prevWatchlists.map((watchlist) =>
            watchlist.id === selectedWatchlistObj.id
              ? { ...watchlist, ticker_list: updatedTickerList }
              : watchlist
          )
        );

        setWatchlistData((prevData) =>
          prevData.filter((data) => data.fs_ticker !== tickerSymbol)
        );
      } catch (error) {
        console.error("Error deleting ticker:", error);
      }
    }
  };
  const handleRowClick = (params: any) => {
    window.open(
      `/technical-analysis?company=${encodeURIComponent(params.row.company)}`,
      "_blank"
    );
  };
  const columns: GridColDef[] = [
    {
      field: "company",
      headerName: "Company",
      width: 160,
      align: "center",
      renderCell: (params) => (
        <span
          style={{ color: "#320144",fontWeight:'bolder', cursor: "pointer" }}
          onClick={() => handleRowClick(params)}
        >
          {params.value}
        </span>
      ),
    },
    { field: "fs_ticker", headerName: "Symbol", width: 150 },
    { field: "price", headerName: "Price ($)", width: 100 },
    { field: "return_field", headerName: "Return (%)", width: 100 },
    { field: "mtd", headerName: "MTD (%)", width: 100 },
    { field: "ytd", headerName: "YTD (%)", width: 100 },
    { field: "one_year", headerName: "1Y Return (%)", width: 100 },
    { field: "fifty_two_week_high", headerName: "52 Week High", width: 100 },
    { field: "fifty_two_week_low", headerName: "52 Week Low", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      renderCell: (params) => (
        <IconButton
          aria-label="delete"
          onClick={() => handleDeleteTicker(params.row.fs_ticker)}
          sx={{
            color: "error.main",
            "&:hover": { backgroundColor: "#ffebee" },
          }}
        >
          <DeleteIcon sx={{ fontSize: "1rem" }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Container sx={{ mt: 5, textAlign: "left" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#002060", fontWeight: "bold" }}
        >
          My Watchlists
        </Typography>
        <Box>
          <Button
            variant="contained"
            onClick={handleCreateWatchlist}
            sx={{ mr: 1, fontSize: "0.75rem" ,color:'#FFFFFF',backgroundColor:'#002060'}}
          >
            Create Watchlist
          </Button>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        sx={{ marginTop: 2 }}
      >
        <FormControl sx={{ width: "300px", marginBottom: 2 }}>
        <MUISelect
  value={selectedWatchlist}
  onChange={handleWatchlistChange}
  size="small"
  displayEmpty // Ensures the placeholder is shown when no value is selected
  renderValue={(selected) => {
    // Check if nothing is selected, show the placeholder
    return selected.length === 0 ? "Existing Watchlists" : selected;
  }}
>
  {watchlists.map((watchlist) => (
    <MenuItem key={watchlist.id} value={watchlist.watchlist_name}>
      {watchlist.watchlist_name}
    </MenuItem>
  ))}
</MUISelect>

        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      ) : watchlistData.length > 0 ? (
        <Box sx={{ height: 500, width: "100%", marginTop: 2 }}>
          <DataGrid
            rows={watchlistData}
            columns={columns}
            rowHeight={35}
            getRowId={(row) => row.fs_ticker}
            sx={{
              height: "100%", // Ensure the grid takes the full height of the container
              overflow: "auto", // Allow scrolling
              "& .MuiDataGrid-columnHeaders": {
                color: "#00331a", // Match color from CryptoDashboard
                backgroundColor: "#f0f0f0", // Light background similar to CryptoDashboard
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center", // Center-align header text
              },
              "& .MuiDataGrid-cell": {
                color: "#000000", // Match color from CryptoDashboard
                fontSize: "1rem",
                padding: "0px",
                paddingLeft: "15px",
                textAlign: "left", // Center-align cell text
              },
              "& .MuiDataGrid-row:nth-of-type(even)": { bgcolor: "#F5F5F5" }, // Match color from CryptoDashboard
              "& .MuiDataGrid-row:nth-of-type(odd)": { bgcolor: "#FFFFFF" }, // Match color from CryptoDashboard
              "& .MuiDataGrid-row:hover": { bgcolor: "#E0E0E0" }, // Match hover color from CryptoDashboard
              "& .MuiDataGrid-cell:focus": {
                outline: "none", // Remove outline when cell is focused
              },
            }}
          />
        </Box>
      ) : null}

      {selectedWatchlist && <NewsList filters={filters} Heading={message} />}
    </Container>
  );
};

export default MyWatchlists;
