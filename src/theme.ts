import { createTheme, ThemeOptions } from '@mui/material/styles';

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => {
  const primaryMain = '#1976d2';
  const secondaryMain = '#dc004e';
  const lightBackgroundDefault = '#f5f5f5';
  const darkBackgroundDefault = '#32373b';
  const lightBackgroundPaper = '#ffffff';
  const darkBackgroundPaper = '#1e1e1e';
  const lightTextPrimary = '#000000';
  const darkTextPrimary = '#ffffff';


  return {
    palette: {
      mode,
      primary: {
        main: primaryMain,
        dark: '#01579b',
        light: '#cfe2f3',
      },
      secondary: {
        main: secondaryMain,
      },
      background: {
        default: mode === 'light' ? lightBackgroundDefault : darkBackgroundDefault,
        paper: mode === 'light' ? lightBackgroundPaper : darkBackgroundPaper,
      },
      text: {
        primary: mode === 'light' ? lightTextPrimary : darkTextPrimary,
        secondary: mode === 'light' ? '#000000' : 'rgba(255, 255, 255, 0.7)',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h1: {
        fontSize: '2.5rem',
        color: mode === 'light' ? lightTextPrimary : darkTextPrimary,
      },
      h2: {
        fontSize: '2rem',
        color: mode === 'light' ? lightTextPrimary : darkTextPrimary,
      },
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 'bold',
            fontSize: '1.2rem',
            color: mode === 'light' ? lightTextPrimary : darkTextPrimary,
            backgroundColor: mode === 'light' ? lightBackgroundPaper : darkBackgroundPaper,
          },
          body: {
            color: mode === 'light' ? lightTextPrimary : darkTextPrimary,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            color: mode === 'light' ? darkTextPrimary : darkTextPrimary,
            '&:hover': {
              color: mode === 'light' ? lightTextPrimary : darkTextPrimary,
              backgroundColor: mode === 'light' ? '#e0e0e0' : '#404040',
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: 'none',
            color: mode === 'light' ? lightTextPrimary : darkTextPrimary,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? primaryMain : darkBackgroundPaper,
            '& .MuiSvgIcon-root': {
              color: mode === 'light' ? darkTextPrimary : darkTextPrimary,
            },
            '& .MuiTypography-root': {
              color: mode === 'light' ? darkTextPrimary : darkTextPrimary,
            },
            '& .MuiButton-root': {
              color: mode === 'light' ? primaryMain : darkTextPrimary,
              backgroundColor: mode === 'light' ? lightBackgroundPaper : darkBackgroundDefault,
            },
            '& .MuiIconButton-root': {
              color: mode === 'light' ? primaryMain : darkTextPrimary,
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: mode === 'light' ? lightTextPrimary : darkTextPrimary,
          },
        },
      },
    },
  };
};

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme(getThemeOptions(mode));
};
