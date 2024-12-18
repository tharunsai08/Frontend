import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
  Snackbar,
  Autocomplete,
  Box,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CryptoNewsForm.css"; // Import the CSS file
import api from "src/api";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CryptoNewsForm: React.FC = () => {
  const [date, setDate] = useState("");
  const [ticker, setTicker] = useState("General");
  const [tickers, setTickers] = useState<string[]>([]);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [document_link, setdocument_link] = useState(""); // State for the link input
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await api.get(`/api/ticker-list/`);
        setTickers(response.data);
      } catch (error) {
        console.error("Error fetching tickers:", error);
      }
    };

    fetchTickers();
  }, []);

  const handleRefresh = () => {
    setDate("");
    setTicker("General");
    setHeading("");
    setDescription("");
    setdocument_link(""); // Reset link field
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !heading) {
      setSnackbarMessage("Date and Heading are compulsory.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const newEntry = { date, ticker, heading, description, document_link }; // Include link in the submission

      await api.post(`/api/create-crypto-daily-news/`, newEntry);

      // Show success snackbar
      setSnackbarMessage("News posted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Clear the input fields
      handleRefresh();
    } catch (error) {
      console.error("Error posting news:", error);
    }
  };

  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
    'color', 'background',
    'list', 'bullet', 'indent',
    'direction', 
    'script',
    'header',
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Grid item xs={12} sx={{ textAlign: "right" }}>
        <IconButton onClick={handleRefresh} color="primary">
          <Refresh />
        </IconButton>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <Autocomplete
            options={tickers}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ticker"
                variant="outlined"
                fullWidth
              />
            )}
            value={ticker}
            isOptionEqualToValue={(option, value) => option === value || value === "General"}
            onChange={(event, newValue) => setTicker(newValue || "General")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            variant="outlined"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                type="text"
                label="Heading"
                variant="outlined"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                InputProps={{
                  style: { fontWeight: "bold" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <ReactQuill
                value={description}
                onChange={setDescription}
                modules={modules}
                formats={formats}
                style={{ minHeight: '200px' }}
                placeholder="Write the description..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="url"
                label="Google Drive Link"
                variant="outlined"
                value={document_link}
                onChange={(e) => setdocument_link(e.target.value)}
                placeholder="Paste the Google Drive document_link here"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end"> {/* Aligns the button to the right */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth={isSmallScreen}
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CryptoNewsForm;
