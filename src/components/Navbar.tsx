import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  useMediaQuery,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import NotificationSnackbar from "./NotificationSnackbar";
import AuthMenu from "./AuthMenu";
import MonitorMenu from "./MonitorMenu";
import DrawerMenu from "./DrawerMenu";
import Logo from "./Logo";
import TradingViewTickerTape from "./CryptoData/TradingViewTickerTape";
import FiberNewIcon from "@mui/icons-material/FiberNew"; // Import the FiberNewIcon

export const safeJSONParse = (
  value: string | null,
  defaultValue: boolean = false
): boolean => {
  try {
    return value ? JSON.parse(value) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const Navbar: React.FC = () => {
  const [anchorElMonitor1, setAnchorElMonitor1] = useState<null | HTMLElement>(
    null
  );
  const [anchorElMonitor2, setAnchorElMonitor2] = useState<null | HTMLElement>(
    null
  );
  const [anchorElMonitor3, setAnchorElMonitor3] = useState<null | HTMLElement>(
    null
  );
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [activeMenuItem, setActiveMenuItem] = useState<string>("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const handleLatestNews = () => {
    navigate("/latest-news");
  };

  const handleMenuItemClick = (label: string, route: string) => {
    setActiveMenuItem(label);
    navigate(route);
  };

  const menuItems1 = [
    { label: "Monitor", route: "/" },
    { label: "Performance Overview", route: "/performance-overview" },
    { label: "Screener", route: "/screener" },
    { label: "Technical Analysis", route: "/technical-analysis" },
    { label: "My Watchlists", route: "/my-watchlists" },
  ].map((item) => ({
    ...item,
    onClick: () => handleMenuItemClick(item.label, item.route),
  }));

  const menuItems2 = [
    { label: "ICO's", route: "/IcoMonitor" },
    { label: "Crypto Publications", route: "/publications" },
    { label: "Crypto Wizard", route: "/index-wizard" },
    { label: "My Portfolios", route: "/portfolios" },
  ].map((item) => ({
    ...item,
    onClick: () => handleMenuItemClick(item.label, item.route),
  }));

  const menuItems3 = [
    { label: "Daily News", route: "/dailynews" },
    { label: "Daily Icos", route: "/dailyico" },
    { label: "Reports", route: "/dailyreport" },
  ].map((item) => ({
    ...item,
    onClick: () => handleMenuItemClick(item.label, item.route),
  }));

  const isSuperuser = safeJSONParse(localStorage.getItem("isSuperuser"), false);

  return (
    <>
      <TradingViewTickerTape />{" "}
      {/* Add the TradingViewTickerTape component here */}
      <AppBar
        position="fixed"
        sx={{
          background: isSuperuser ? "#4c72bd" : "#444444 ", // Corrected ternary operator usage
          color: "#ffffff",
          top: "50px", // Adjust this if necessary to ensure it doesn’t overlap with the ticker tape
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "50px !important",
          }}
        >
          <RouterLink
            to="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Logo />
          </RouterLink>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="start"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <DrawerMenu
                drawerOpen={drawerOpen}
                toggleDrawer={toggleDrawer}
                menuItems={[...menuItems1, ...menuItems2]}
              />
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                color="inherit"
                onClick={handleLatestNews}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  position: "relative",
                }}
              >
                <FiberNewIcon sx={{ color: "yellow", marginRight: "4px" }} />{" "}
                {/* Use the FiberNewIcon here */}
                Latest News
              </Button>
              <MonitorMenu
                anchorEl={anchorElMonitor1}
                setAnchorEl={setAnchorElMonitor1}
                menuItems={menuItems1}
                menuName="CRYPTO MONITOR"
                activeMenuItem={activeMenuItem}
              />
              <MonitorMenu
                anchorEl={anchorElMonitor2}
                setAnchorEl={setAnchorElMonitor2}
                menuItems={menuItems2}
                menuName="CRYPTO INDICATORS"
                activeMenuItem={activeMenuItem}
              />
              {isSuperuser && (
                <MonitorMenu
                  anchorEl={anchorElMonitor3}
                  setAnchorEl={setAnchorElMonitor3}
                  menuItems={menuItems3}
                  menuName="CRYPTO DAILY POST"
                  activeMenuItem={activeMenuItem}
                />
              )}
              <AuthMenu
                userMenuAnchorEl={userMenuAnchorEl}
                setUserMenuAnchorEl={setUserMenuAnchorEl}
                showSnackbar={showSnackbar}
              />
            </Box>
          )}
          <NotificationSnackbar
            open={snackbarOpen}
            message={snackbarMessage}
            onClose={handleSnackbarClose}
          />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
