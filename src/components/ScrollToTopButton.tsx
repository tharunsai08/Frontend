// ScrollToTopButton.tsx

import React from 'react';
import { IconButton, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { animateScroll } from 'react-scroll';

const scrollButtonStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '10px',
  right: '10px',
  backgroundColor: '#002060',
  color: '#ffffff',
  borderRadius: '50%',
  cursor: 'pointer',
  transition: 'opacity 0.3s ease-in-out',
};

const ScrollToTopButton: React.FC = () => {
  const handleClick = () => {
    animateScroll.scrollToTop({ duration: 500 });
  };

  return (
    <Zoom in={true}>
      <div onClick={handleClick} role="presentation" style={scrollButtonStyle}>
        <IconButton aria-label="scroll to top">
          <KeyboardArrowUpIcon style={{ color: '#ffffff' }} />
        </IconButton>
      </div>
    </Zoom>
  );
};

export default ScrollToTopButton;
