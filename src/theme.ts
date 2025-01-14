import { createTheme, ThemeOptions } from '@mui/material/styles';

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#1976d2',
      dark: '#01579b',
      light: '#cfe2f3',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#32373b',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#1976d2' : '#ffffff',
      secondary: mode === 'light' ? '#000000' : 'rgba(255, 255, 255, 0.7)',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: mode === 'light' ? '#ffffff' : '#ffffff', 
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#1976d2' : '#1e1e1e', 
          '& .MuiSvgIcon-root': {  
            color: mode === 'light' ? '#ffffff' : '#ffffff',  
          },
          '& .MuiTypography-root': {  
            color: mode === 'light' ? '#ffffff' : '#ffffff', 
          },
          '& .MuiButton-root': {  
            color: mode === 'light' ? '#1976d2' : '#1e1e1e', 
            backgroundColor: mode === 'light' ? '#ffffff' : '#ffffff',
          },
          '& .MuiIconButton-root': {  
            color: mode === 'light' ? '#ffffff' : '#ffffff', 
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: mode === 'light' ? '#1976d2' : '#ffffff',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
    },
    h2: {
      fontSize: '2rem',
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme(getThemeOptions(mode));
};