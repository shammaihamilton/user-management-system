import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Navbar from "../navbar/navbar";
import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";
import DarkModeToggler from "../../DarkModeToggler";
import "./header.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { logout } from "../../../redux/thunks/authThunk";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const handleLogout = () => {
    dispatch(logout());
  };
  if (error) {
    alert(error);
    console.error("Error during logout:", error);
  }
  return (
    <AppBar position="static" className="header-content" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: "#000", fontSize: "1.5rem" }}
        >
          <MuiLink component={Link} to="/" variant="h6">  
            <HomeIcon className="home-icon" />
          </MuiLink>

          <DarkModeToggler />
          {/* Theme Toggler */}
        </Typography>

        <Navbar />
        <Button
          onClick={handleLogout}
          variant="contained"
          sx={{
            backgroundColor: "white",
            color: theme.palette.primary.main,
            fontWeight: "bold",
            fontSize: "1.2rem",
            "&:hover": {
              backgroundColor: theme.palette.primary.light,
              color: "black",
            },
          }}
          disabled={loading}
        >
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
