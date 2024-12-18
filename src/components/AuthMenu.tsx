import React from 'react';
import { Menu, MenuItem, Button } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useAuth } from './AuthContext';

import { useNavigate } from 'react-router-dom';
import api from 'src/api';

interface AuthMenuProps {
  userMenuAnchorEl: HTMLElement | null;
  setUserMenuAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  showSnackbar: (message: string) => void;
}

const AuthMenu: React.FC<AuthMenuProps> = ({ userMenuAnchorEl, setUserMenuAnchorEl, showSnackbar }) => {
  const { user, isAuthenticated, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await api.post(`/api/logout/`)

      if (response) {
        logout();
        setUserMenuAnchorEl(null);
        showSnackbar('Successfully logged out!');
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <Button
            color="inherit"
            sx={{ fontWeight: 'bold', marginLeft: 2 }}
            onClick={(event) => setUserMenuAnchorEl(event.currentTarget)}
          >
            Hi, {user}
          </Button>
          <Menu
            anchorEl={userMenuAnchorEl}
            open={Boolean(userMenuAnchorEl)}
            onClose={() => setUserMenuAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          color="inherit"
          sx={{ fontWeight: 'bold', marginLeft: 2 }}
          component={Link} // Use Link component for routing
          to="/login" // Provide the route
        >
          Login
        </Button>
      )}
    </>
  );
};

export default AuthMenu;
