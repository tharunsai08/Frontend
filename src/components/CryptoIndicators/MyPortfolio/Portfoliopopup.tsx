// PortfolioPopup.tsx
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface PortfolioPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  selected: string[];
}

const PortfolioPopup: React.FC<PortfolioPopupProps> = ({
  open,
  onClose,
  onSave,
  selected,
}) => {
  const [portfolioName, setPortfolioName] = React.useState("");

  const handleSave = () => {
    onSave(portfolioName);
    setPortfolioName("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="subtitle2">Create New Portfolio</Typography>
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
        <TextField
          autoFocus
          margin="dense"
          id="portfolio-name"
          label="Portfolio Name"
          type="text"
          fullWidth
          variant="outlined"
          value={portfolioName}
          onChange={(e) => setPortfolioName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
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
      </DialogActions>
    </Dialog>
  );
};

export default PortfolioPopup;
