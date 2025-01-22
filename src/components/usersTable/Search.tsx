import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div style={{ textAlign: "center", margin: "20px auto", width: "50%" }}>
      <TextField
        variant="outlined"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon style={{ opacity: 0.7 }} />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default Search;
