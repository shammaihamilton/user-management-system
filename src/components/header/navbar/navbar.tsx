import { Link as MuiLink, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "./navbar.scss";

export default function Navbar() {
  return (
    <Box className="navbar">
      <MuiLink component={Link} to="/" variant="h6">
        Home
      </MuiLink>
      <MuiLink component={Link} to="/todo" color="primary" variant="h6">
        Todo
      </MuiLink>
      {/* <MuiLink component={Link} to="/users" variant="h6">
        Users
      </MuiLink> */}
      <MuiLink component={Link} to="/usersPage" variant="h6">
        Users 
      </MuiLink>
    </Box>
  );
}
