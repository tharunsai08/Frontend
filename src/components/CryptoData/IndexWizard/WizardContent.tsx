import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import FundamentalFilters from "./FundamentalFilters";
import TechnicalFilters from "./TechnicalFilters";
import QuantFilters from "./QuantFilters";

interface WizardContentProps {
  data: {
    sectors: { [key: string]: string[] };
    market_cap: { [key: string]: string[] };
  };
  step: number;
  count: number;
}

const WizardContent: React.FC<WizardContentProps> = ({ data, step, count }) => {
  const [openPopup, setOpenPopup] = useState(false);

  const handleIconClick = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const processSectorsData = (sectors: { [key: string]: string[] }) => {
    return Object.keys(sectors).map((sector) => ({
      sector,
      offcoins: sectors[sector].length,
    }));
  };

  const processMarketCapData = (marketCap: { [key: string]: string[] }) => {
    return Object.keys(marketCap).map((category) => ({
      marketCap: category,
      offcoins: marketCap[category].length,
    }));
  };

  if (!data) return <CircularProgress />;

  const sectorData = processSectorsData(data.sectors);
  const marketCapData = processMarketCapData(data.market_cap);

  const renderPopup = () => {
    switch (step) {
      case 0:
        return (
          <FundamentalFilters open={openPopup} onClose={handleClosePopup} />
        );
      case 1:
        return <TechnicalFilters open={openPopup} onClose={handleClosePopup} />;
      case 2:
        return <QuantFilters open={openPopup} onClose={handleClosePopup} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box>
        <Card
          sx={{
            height: 500,
            width: 275,
            borderRadius: 2,
            boxShadow: "0px 4px 10px rgba(1, 108, 95, 0.5)", // Custom shadow with color #016c5f
          }}
          elevation={6}
        >
          <CardContent sx={{ height: "100%", overflow: "auto" }}>
            <Typography
              sx={{
                color: "#000000",
                fontWeight: "bold",
                fontSize: "0.9rem",
                marginBottom: 1,
              }}
            >
              Total Coin Count: <span style={{color:'#002060'}}>{count}</span>
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 10,
                borderRadius: 1,
                backgroundColor: "#93b8bf",
                color: "#2e0449",
                padding: 1,
              }}
            >
              <Typography
                sx={{ fontWeight: "bold", flex: 1, fontSize: "0.9rem " }}
              >
                Sector
              </Typography>
              <Typography
                sx={{ fontWeight: "bold", flex: 1, fontSize: "0.9rem " }}
              >
                Offcoins
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: 1,
                height: 260,
                overflowY: "auto",
                "&::-webkit-scrollbar": {
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
                },
              }}
            >
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow></TableRow>
                  </TableHead>
                  <TableBody>
                    {sectorData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontSize: "0.9rem" ,color:'#000000'}}>
                          {row.sector}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.9rem",color:'#000000' }}>
                          {row.offcoins}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box
              sx={{
                marginTop: 2,
                backgroundColor: "#f0f0f0",
                color: "#2e0449",
                borderRadius: 1,
                maxHeight: 250,
                overflowY: "auto",
              }}
            >
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: "#93b8bf",
                          color: "#2e0449",
                        }}
                      >
                        Market Cap
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: "#93b8bf",
                          color: "#2e0449",
                        }}
                      >
                        Offcoins
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {marketCapData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{  fontSize: "0.9rem",color:'#000000'}}>
                          {row.marketCap}
                        </TableCell>
                        <TableCell sx={{  fontSize: "0.9rem",color:'#000000'}}>
                          {row.offcoins}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
      {step < 3 && (
        <Box
          display="flex"
          alignItems="center"
          flexDirection="row"
          mr={2}
          marginLeft={2}
        >
          <IconButton onClick={handleIconClick}>
            <Typography variant="body2" style={{ marginRight: 4,color:'#002060',fontWeight:'bold' }}>
              {step === 0 && "Fundamental"}
              {step === 1 && "Technical"}
              {step === 2 && "Quant"}
            </Typography>
            <SettingsIcon />
          </IconButton>
        </Box>
      )}
      {renderPopup()}
    </Box>
  );
};

export default WizardContent;
