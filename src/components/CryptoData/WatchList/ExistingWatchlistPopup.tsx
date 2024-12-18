import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// export interface Watchlist {
//   id: number;
//   watchlist_name: string;
// }

interface ExistingWatchlistPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  noSelection: boolean;
  existingWatchlists: any[];
  selectedWatchlist: string;
  setSelectedWatchlist: (watchlist: string) => void;
}

const ExistingWatchlistPopup: React.FC<ExistingWatchlistPopupProps> = ({
  open,
  onClose,
  onSave,
  noSelection,
  existingWatchlists,
  selectedWatchlist,
  setSelectedWatchlist
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ maxWidth: '475px', margin: 'auto' }}
    >
      <DialogTitle>
        <Typography variant="subtitle2">
          {noSelection
            ? "Select coins to add to the Existing WL"
            : "Add to Existing Watchlist"}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 15,
            top: 15,
            color: "#f52a4c",
            border: '1px solid #f52a4c',
            borderRadius: '50%',
            padding: '2px',
            "&:hover": {
              backgroundColor: '#f52a4c',
              color: '#FFFFFF',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {!noSelection && (
          <FormControl fullWidth>
            <InputLabel id="select-watchlist-label">Select Watchlist</InputLabel>
            <Select
              labelId="select-watchlist-label"
              id="select-watchlist"
              value={selectedWatchlist}
              onChange={(e) => setSelectedWatchlist(e.target.value)}
              label="Select Watchlist"
            >
              {existingWatchlists.map((watchlist) => (
                <MenuItem key={watchlist.id} value={watchlist.watchlist_name}>
                  {watchlist.watchlist_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
              onClick={onSave}
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
  );
};

export default ExistingWatchlistPopup;
