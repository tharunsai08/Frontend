import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';

interface MonitorMenuProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  menuItems: { label: string; route: string; onClick: () => void }[];
  menuName: string;
  activeMenuItem: string; // Prop to track the active menu item
}

const MonitorMenu: React.FC<MonitorMenuProps> = ({ anchorEl, setAnchorEl, menuItems, menuName, activeMenuItem }) => {
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        color="inherit"
        aria-controls="crypto-monitor-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        sx={{ fontWeight: 'bold' }}
        endIcon={<ArrowDropDownIcon />}
      >
        {menuName}
      </Button>
      <Menu
        id="crypto-monitor-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick();
              handleMenuClose();
            }}
            sx={{
              backgroundColor: item.label === activeMenuItem ? '#444444' : 'transparent',
              color: item.label === activeMenuItem ? '#FFFFFF' : '#000000', // Default text color for non-active
              '&:hover': {
                color: '#FFFFFF', // Ensure hover color is set to white for all items
                backgroundColor: item.label === activeMenuItem ? '#444444' : '#444444', // Background color on hover
              },
            }}
          >
            <RouterLink to={item.route} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
              {item.label}
            </RouterLink>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MonitorMenu;
