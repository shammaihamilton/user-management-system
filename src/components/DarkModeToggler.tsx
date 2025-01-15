
import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleMode } from '../redux/slices/themeSlice';
import IconButton from '@mui/material/IconButton';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const DarkModeToggler: React.FC = () => {

  const dispatch = useDispatch();
  const theme = useTheme();


  return (
    <IconButton
      color="inherit"
      onClick={() => dispatch(toggleMode())}
      aria-label="toggle theme"
      sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000', paddingBottom: '1.6rem' }}
    >
      {theme.palette.mode === 'light' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

export default DarkModeToggler;