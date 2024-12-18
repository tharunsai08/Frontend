import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, IconButton, Grid, Typography, Snackbar, Alert, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from "src/api"; // Import the configured Axios instance

interface WatchlistPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  noSelection: boolean;
  selectedTickers?: string[];
}

const WatchlistPopup: React.FC<WatchlistPopupProps> = ({ open, onClose, onSave, noSelection, selectedTickers = [] }) => {
  const [watchlistName, setWatchlistName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleSave = async () => {
    if (!watchlistName) return;

    onSave(watchlistName);

    try {
      await api.post(`/api/create-watchlists/`, {
        watchlist_name: watchlistName,
        ticker_list: selectedTickers,
      });
      setWatchlistName("");
      setSnackbarMessage("Watchlist created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error creating watchlist:", error);
      setSnackbarMessage("Error creating watchlist. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        sx={{ maxWidth: "475px", margin: "auto" }}
      >
        <DialogTitle>
          <Typography variant="subtitle2">
            {noSelection
              ? "Select Coins to Create Watchlist"
              : "Create Watchlist"}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 15,
              top: 15,
              color: "#f52a4c",
              border: "1px solid #f52a4c",
              borderRadius: "50%",
              padding: "2px",
              "&:hover": {
                backgroundColor: "#f52a4c",
                color: "#FFFFFF",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {!noSelection && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Watchlist Name"
                type="text"
                placeholder="Enter Your Watchlist Name"
                fullWidth
                value={watchlistName}
                onChange={(e) => setWatchlistName(e.target.value)}
                InputProps={{
                  style: { fontSize: "14px" },
                }}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              {selectedTickers.length > 0 && (
                <Grid container spacing={1} sx={{ marginTop: "16px" }}>
                  <Typography variant="h6" sx={{ width: "100%", marginBottom: "8px" }}>
                    Selected Tickers ({selectedTickers.length}) :
                  </Typography>
                  {selectedTickers.map((ticker, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <Chip
                        label={ticker}
                        color="primary"
                        size="small"
                        sx={{
                          width: "100%",
                          marginBottom: "8px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {!noSelection && (
            <>
              <Button
                onClick={onClose}
                sx={{
                  color: "#f52a4c",
                  borderColor: "#f52a4c",
                  backgroundColor: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#FFFFFF",
                    borderColor: "#f52a4c",
                  },
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                sx={{
                  backgroundColor: "#136f63",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#0b4e44",
                  },
                }}
                variant="contained"
              >
                Save
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WatchlistPopup;
