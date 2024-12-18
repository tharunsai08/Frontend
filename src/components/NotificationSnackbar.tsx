// src/components/NotificationSnackbar.tsx
import React from 'react';
import { Snackbar, Button, SnackbarCloseReason } from '@mui/material';

interface NotificationSnackbarProps {
    open: boolean;
    message: string;
    onClose: (event: React.SyntheticEvent | Event, reason: SnackbarCloseReason) => void;
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({ open, message, onClose }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={1500}
            onClose={onClose}
            message={message}
            color='blue'
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            action={
                <Button color="inherit" onClick={(event) => onClose(event, 'clickaway')}>
                    Close
                </Button>
            }
        />
    );
};

export default NotificationSnackbar;
