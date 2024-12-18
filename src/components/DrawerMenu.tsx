import React from 'react';
import { Drawer, Box, List, ListItem, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface DrawerMenuProps {
  drawerOpen: boolean;
  toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
  menuItems: { label: string; route: string }[];
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ drawerOpen, toggleDrawer, menuItems }) => (
  <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {menuItems.map((item, index) => (
          <ListItem button component={RouterLink} to={item.route} key={index}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  </Drawer>
);

export default DrawerMenu;
