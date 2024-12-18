import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import { useFormikContext } from "formik";
import WizardContent from "./WizardContent";
import WizardOutputTable from "./WizardOutputTable";
import api from "src/api";
import WatchlistPopup from "../WatchList/WatchlistPopup";
import TopReturnsAndSectorChart from "./TopReturnsAndSectorChart";
import CumulativeReturns from "./CumulativeReturns";

const IndexWizard: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [data, setData] = useState<any>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [watchlistPopupOpen, setWatchlistPopupOpen] = useState(false);
  const [noSelection, setNoSelection] = useState(false);
  const { values, resetForm, setFieldValue } = useFormikContext<any>();

  const getFiltersForStep = (step: number) => {
    switch (step) {
      case 0:
        return { ticker_list: [] };
      case 1:
        return {
          Fundamental: values.Fundamental,
          ticker_list: values.ticker_list,
        };
      case 2:
        return { Fundamental: values.Fundamental, Technical: values.Technical };
      case 3:
        return {
          Fundamental: values.Fundamental,
          Technical: values.Technical,
          Quant: values.Quant,
        };
      default:
        return {};
    }
  };

  const fetchDataForStep = async (step: number) => {
    try {
      const filters = getFiltersForStep(step);
      const response = await api.post(
        "/api/crypto-Indexwizard-filter/",
        filters
      );
      setData((prevData: any) => ({ ...prevData, [step]: response.data }));
      setFieldValue("ticker_list", response.data.ticker_list);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataForStep(0);
  }, []);

  useEffect(() => {
    fetchDataForStep(step);
  }, [step]);

  const handleNext = () => {
    if (step < 3) {
      const nextStep = step + 1;
      setStep(nextStep);

      let message;
      switch (nextStep) {
        case 1:
          message = "Fundamental Filters are applied";
          break;
        case 2:
          message = "Technical Filters are Apllied.";
          break;
        default:
          message = "All Filters Applied.";
      }
      setSnackbarMessage(message);
      setOpenSnackbar(true);
    }
  };

  const handleStartOver = () => {
    setStep(0);
    resetForm();
    setData({});
  };

  const getStepColor = (index: number): string => {
    if (index === step) return "#7f0535";
    if (index < step) return "#7f0535";
    return "#a5a3a3";
  };

  const getIconColor = (index: number): string => {
    return index <= step ? "#FFFFFF" : getStepColor(index);
  };

  const handleWatchlistPopupClose = () => {
    setWatchlistPopupOpen(false);
  };
  const handleSaveWatchlist = (name: string) => {
    setWatchlistPopupOpen(false);
  };
  const handleWatchlistClick = () => {
    setNoSelection(false);
    setWatchlistPopupOpen(true);
  };

  const renderStepContent = (stepIndex: number) => {
    const stepData = data[stepIndex];
  
    // Show loading spinner if data is not available
    if (!data || data.length === 0) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      );
    }
  
    if (!stepData) {
      return <CircularProgress />

    }
  
    return (
      <>
        {stepIndex >= 0 && (
          <WizardContent data={data[0]} step={0} count={data[0].count} />
        )}{" "}
        {/* No filters */}
        {stepIndex >= 1 && (
          <WizardContent data={data[1]} step={1} count={data[1].count} />
        )}{" "}
        {/* With fundamental filters */}
        {stepIndex >= 2 && (
          <WizardContent data={data[2]} step={2} count={data[2].count} />
        )}{" "}
        {/* With technical filters */}
        {stepIndex >= 3 && (
          <WizardContent data={data[3]} step={3} count={data[3].count} />
        )}{" "}
        {/* With quant filters */}
      </>
    );
  };

  return (
    <Container sx={{ mt: 5, textAlign: "left" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#002060", fontWeight: "bold" }}
      >
        Crypto Wizard
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="body1">
          Crypto Wizard helps you filter crypto data using predefined filters
          that help for crypto ideas.
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {step > 0 && (
            <Button
              variant="contained"
              onClick={handleStartOver}
              sx={{
                color: "#FFFFFF",
                backgroundColor: "#1e8818",
                borderColor: "#7f0535",
                fontSize: "0.75rem",
                textTransform: "capitalize",
                padding: "6px 12px",
              }}
            >
              Start Over
            </Button>
          )}
          {step < 3 && (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                backgroundColor: "#002060",
                color: "#fff",
                fontSize: "0.75rem",
                textTransform: "capitalize",
                padding: "6px 12px",
              }}
            >
              Next
            </Button>
          )}
          {step === 3 && (
            <Button
              variant="contained"
              onClick={handleWatchlistClick}
              sx={{
                backgroundColor: "#007bff",
                color: "#fff",
                fontSize: "0.75rem",
                textTransform: "capitalize",
                padding: "6px 12px",
              }}
            >
              Save to Watchlist
            </Button>
          )}
        </Box>
      </Box>

      <Grid container alignItems="center" sx={{ mb: 3 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <React.Fragment key={index}>
            <Grid
              item
              sx={{ maxWidth: 50, textAlign: "center", marginTop: "10px" }}
            >
              <IconButton
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  bgcolor: getStepColor(index),
                  color: getIconColor(index),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  marginLeft: "10px",
                  marginRight: "5px",
                }}
              >
                {index <= step ? (
                  <EditSharpIcon sx={{ fontSize: "1rem" }} />
                ) : (
                  <Typography
                    sx={{ color: getIconColor(index), fontSize: "0.8rem" }}
                  >
                    {index + 1}
                  </Typography>
                )}
              </IconButton>
              <Typography
                sx={{
                  color: getStepColor(index),
                  fontSize: "12px",
                  marginTop: "10px",
                }}
              >
                Step {index + 1}
              </Typography>
              <Typography sx={{ color: getStepColor(index), fontSize: "14px" }}>
                {(() => {
                  switch (index) {
                    case 0:
                      return "Top";
                    case 1:
                      return "Fundamentals";
                    case 2:
                      return "Technicals";
                    case 3:
                      return "Quant";
                    default:
                      return "";
                  }
                })()}
              </Typography>
            </Grid>
            {index < 3 && (
              <Grid item>
                <Box
                  sx={{
                    width: 320,
                    height: "2px",
                    marginBottom: "30px",
                    backgroundColor: getStepColor(index + 1),
                  }}
                />
              </Grid>
            )}
          </React.Fragment>
        ))}
      </Grid>

      <Box
        sx={{ minHeight: 200, display: "flex", flexDirection: "row", gap: 2 }}
      >
        {renderStepContent(step)}
      </Box>
      {step > 2 && (
        <Card sx={{ 
          marginBottom: '16px', 
          boxShadow: '0 4px 8px 0 #c6f5e4, 0 6px 20px 0 #c6f5e4' 
        }}>
          <CardContent>
              <WizardOutputTable ticker_list={values.ticker_list} />
          </CardContent>
        </Card>
      )}
      {step > 2 && <CumulativeReturns ticker_list={values.ticker_list} />}
      {step > 2 && (
        <TopReturnsAndSectorChart
          ticker_list={values.ticker_list}
          prices_list={[]}
          quantity_list={[]}
        />
      )}

      <WatchlistPopup
        open={watchlistPopupOpen}
        onClose={handleWatchlistPopupClose}
        onSave={handleSaveWatchlist}
        noSelection={noSelection}
        selectedTickers={values.ticker_list}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert onClose={() => setOpenSnackbar(false)}>{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default IndexWizard;
