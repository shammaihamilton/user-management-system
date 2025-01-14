
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo } from 'react';
import { createAppTheme } from './theme';

function App() {
  const isAuth = useSelector((state: RootState) => !!state.auth.isAuthenticated);
  const mode = useSelector((state: RootState) => state.theme.mode);
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  
  const router = createBrowserRouter(routes({ isAuth }));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;