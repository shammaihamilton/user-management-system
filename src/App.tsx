import {
  createBrowserRouter,
  redirect,
  // redirect,
  RouterProvider,
} from "react-router-dom";
import routes from "./routes/routes";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { 
  useEffect,
  // useEffect,
   useMemo } from "react";
import { createAppTheme } from "./theme";
import { ToastContainer } from "react-toastify";
function App() {
  const isAuth = useSelector(
    (state: RootState) => !!state.auth.isAuthenticated
  );
  const mode = useSelector((state: RootState) => state.theme.mode);
  const token = useSelector((state: any) => state.auth.token);
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const router = createBrowserRouter(routes({ isAuth }));

  useEffect(() => {
    if (!token) {
      console.error("No authentication token found");
      redirect("/login");
      return;
    }
  }, [token]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
