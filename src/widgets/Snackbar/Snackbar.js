import React, { useState, useEffect } from 'react';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import styles from './Snackbar.module.css';

const Snackbar = ({ 
  open, 
  message, 
  severity = 'error', 
  duration = 6000, 
  onClose,
  position = 'top-right'
}) => {
  const [isOpen, setIsOpen] = useState(open || false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <MuiSnackbar
      open={isOpen}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{
        vertical: position.includes('top') ? 'top' : 'bottom',
        horizontal: position.includes('center') ? 'center' : (position.includes('right') ? 'right' : 'left')
      }}
      className={styles.snackbar}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity}
        className={styles.alert}
        variant="filled"
      >
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
