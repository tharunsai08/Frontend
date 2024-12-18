import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  SelectChangeEvent,
  TableSortLabel,
  Card,
  CardContent,
  Button,
} from "@mui/material";

import CreatePortfolioDialog from "./CreatePortfolioDialog";
import NewsList from "../CryptoDailyData/CryptoNews/NewsList";

import api from "src/api";
import TopReturnsAndSectorChart from "../CryptoData/IndexWizard/TopReturnsAndSectorChart";

interface PortfolioDetail {
  id: number;
  ticker_name: string;
  purchase_price: number;
  purchase_date: string; // Change to string to handle formatting
  current_price: number;
  quantity: number;
  invested_amount: number;
  current_value: number;
  returns: number;
}

interface PortfolioData {
  total_value: {
    invested_amount: number;
    current_value: number;
    total_returns: number;
  };
  portfolio_details: PortfolioDetail[];
}

type Order = "asc" | "desc";

const Myportfolio: React.FC = () => {
  const [portfolios, setPortfolios] = useState<string[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("");
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof PortfolioDetail>("ticker_name");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const fetchPortfolioNames = useCallback(() => {
    api
      .get(`/api/portfolio-names-list/`)
      .then((response: { data: React.SetStateAction<string[]> }) =>
        setPortfolios(response.data)
      )
      .catch((error: any) =>
        console.error("Error fetching portfolios:", error)
      );
  }, []);

  const fetchPortfolioData = useCallback((portfolioName: string) => {
    api
      .get(`/api/get-portfolio/${portfolioName}`)
      .then((response: { data: React.SetStateAction<PortfolioData | null> }) =>
        setPortfolioData(response.data)
      )
      .catch((error: any) =>
        console.error("Error fetching portfolio data:", error)
      );
  }, []);

  useEffect(() => {
    fetchPortfolioNames();
  }, [fetchPortfolioNames]);

  useEffect(() => {
    if (selectedPortfolio) {
      fetchPortfolioData(selectedPortfolio);
    }
  }, [selectedPortfolio, fetchPortfolioData]);

  const handlePortfolioChange = (event: SelectChangeEvent<string>) => {
    const portfolioName = event.target.value;
    setSelectedPortfolio(portfolioName);
  };

  const handleRequestSort = (property: keyof PortfolioDetail) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedPortfolioDetails = portfolioData
    ? [...portfolioData.portfolio_details].sort((a, b) => {
        if (orderBy === "ticker_name") {
          return order === "asc"
            ? a.ticker_name.localeCompare(b.ticker_name)
            : b.ticker_name.localeCompare(a.ticker_name);
        } else {
          // Cast values to number before arithmetic operation
          const aValue = Number(a[orderBy]);
          const bValue = Number(b[orderBy]);

          return order === "asc" ? aValue - bValue : bValue - aValue;
        }
      })
    : [];

  const calculateInvestmentDuration = (purchaseDate: string) => {
    const today = new Date();
    const purchase = new Date(purchaseDate);
    const differenceInMilliseconds = today.getTime() - purchase.getTime();
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    const differenceInYears = (differenceInDays / 365).toFixed(1); // Rounded to one decimal place
    return differenceInDays > 365
      ? `${differenceInYears} years`
      : `${differenceInDays} days`;
  };

  const handleCreatePortfolioOpen = () => {
    setDialogOpen(true);
    setSelectedPortfolio("");
  };

  const handleCreatePortfolioClose = (newPortfolioName?: string) => {
    setDialogOpen(false);
    if (newPortfolioName) {
      handlePortfolioCreated(newPortfolioName);
    }
  };

  const handlePortfolioCreated = (newPortfolioName: string) => {
    fetchPortfolioNames();
    setSelectedPortfolio(newPortfolioName);
    fetchPortfolioData(newPortfolioName);
  };

  const handleExistingPortfolio = () => {
    setDialogOpen(true);
  };

  const portfolioTickers = portfolioData
    ? portfolioData.portfolio_details.map((detail) => detail.ticker_name)
    : [];
  const priceList = portfolioData
    ? portfolioData.portfolio_details.map((detail) => detail.purchase_price)
    : [];
  const quantityList = portfolioData
    ? portfolioData.portfolio_details.map((detail) => detail.quantity)
    : [];

  const updatedTickers = ["General", ...portfolioTickers];

  return (
    <Container sx={{ mt: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "#002060", fontWeight: "bold", textAlign: "left" }}
        >
          My Portfolio
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControl sx={{ minWidth: 220, mr: 2 }}>
            <Select
              labelId="portfolio-select-label"
              sx={{
                fontSize: "0.825rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#002060", // Keeps the bottom line visible
                },
              }}
              value={selectedPortfolio}
              onChange={handlePortfolioChange}
              onOpen={fetchPortfolioNames}
              displayEmpty
              renderValue={(selected) => {
                return selected ? selected : "Select Portfolio"; // Keeps placeholder
              }}
            >
              {portfolios.map((portfolio) => (
                <MenuItem key={portfolio} value={portfolio}>
                  {portfolio}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreatePortfolioOpen}
            sx={{ fontSize: "0.75rem",color:'#ffffff',bgcolor:'#002060' }} // Adjust button size
          >
            Create Portfolio
          </Button>
        </Box>
      </Box>

      {selectedPortfolio === "" && (
        <Typography variant="h6" sx={{ color: "#d32f2f", mb: 2 }}>
          Please select a portfolio from the dropdown or Create a New Portfolio.
        </Typography>
      )}
      {portfolioData && (
        <>
          <Card sx={{ mb: 4, p: 2, borderRadius: "8px", boxShadow: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#002060", fontWeight: "bold" }}
                  >
                    Total Invested Amount
                  </Typography>
                  <Typography variant="h5" sx={{ color: "#002060" }}>
                    $
                    {Math.floor(
                      portfolioData.total_value.invested_amount
                    ).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#002060", fontWeight: "bold" }}
                  >
                    Current Value
                  </Typography>
                  <Typography variant="h5" sx={{ color: "#002060" }}>
                    $
                    {Math.floor(
                      portfolioData.total_value.current_value
                    ).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#002060", fontWeight: "bold" }}
                  >
                    Total Returns
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color:
                        portfolioData.total_value.total_returns >= 0
                          ? "#2e7d32"
                          : "#d32f2f",
                    }}
                  >
                    {portfolioData.total_value.total_returns.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleExistingPortfolio}
              sx={{
                fontSize: "0.75rem", // Adjust button size
                backgroundColor: "#076783",
                color: "white",
                "&:hover": {
                  backgroundColor: "#06546b", // Optional: slightly darker color on hover
                },
              }}
            >
              Add More Assets
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "ticker_name",
                    "purchase_price ($)",
                    "purchase_date",
                    "current_price ($)",
                    "quantity",
                    "invested_amount ($)",
                    "current_value ($)",
                    "returns (%)",
                    "investment_duration",
                  ].map((headCell) => (
                    <TableCell
                      key={headCell}
                      sortDirection={orderBy === headCell ? order : false}
                      sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
                    >
                      <TableSortLabel
                        active={orderBy === headCell}
                        direction={orderBy === headCell ? order : "asc"}
                        onClick={() =>
                          handleRequestSort(headCell as keyof PortfolioDetail)
                        }
                      >
                        {headCell.replace("_", " ").toUpperCase()}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPortfolioDetails.map((detail, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        detail.returns >= 0 ? "#e8f5e9" : "#ffebee",
                      height: "40px", // Adjust row height as needed
                    }}
                  >
                    <TableCell sx={{ fontSize: "0.875rem", padding: "6px" }}>
                      {detail.ticker_name}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem", padding: "6px" }}>
                      $
                      {Number(
                        detail.purchase_price.toFixed(2)
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem", padding: "6px" }}>
                      {new Date(detail.purchase_date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem", padding: "6px" }}>
                      $
                      {Number(detail.current_price.toFixed(2)).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem", padding: "6px" }}>
                      {detail.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem", padding: "6px" }}>
                      $
                      {Number(
                        detail.invested_amount.toFixed(2)
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem", padding: "6px" }}>
                      $
                      {Number(detail.current_value.toFixed(2)).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem", padding: "6px" }}>
                      {detail.returns.toFixed(2)}%
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.875rem", padding: "6px" }}>
                      {calculateInvestmentDuration(detail.purchase_date)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TopReturnsAndSectorChart
            ticker_list={portfolioTickers}
            prices_list={priceList}
            quantity_list={quantityList}
          />
          <NewsList
            Heading="News related to this Portfolio"
            filters={updatedTickers}
          />
        </>
      )}
      <CreatePortfolioDialog
        open={dialogOpen}
        onClose={handleCreatePortfolioClose}
        portfolio_name={selectedPortfolio}
        onPortfolioCreated={handlePortfolioCreated}
      />
    </Container>
  );
};

export default Myportfolio;
