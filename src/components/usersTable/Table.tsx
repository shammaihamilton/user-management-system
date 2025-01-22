import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
// import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { Button, CircularProgress } from "@mui/material";
import { TableHeadr } from "./TableHeader";
import { useUserContext } from "../../context/useUserContext";
import { TableToolbar } from "./TableToolbar";
import "./Table.scss";
import { useTableState } from "../../hooks/useTableState";
// import { useState } from "react";
import Search from "./Search";
import { Pagination } from "./Pagination";
import { useSearchAndPagination } from "../../hooks/useSearchAndPagination";

export default function EnhancedTable() {
  const {
    handleDeleteUser,
    showUserPage,
    error,
    users,
    headCells,
    selected,
    setSelected,
    loading,
    toggleSearchBar,
    showSearchBar,
  } = useUserContext();

  const {
    order,
    orderBy,
    dense,
    emptyRows,
    handleRequestSort,
    handleClick,
    setDense,
    handleSelectAllClick,
  } = useTableState({ users, selected, setSelected });

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    currentList: data,
    totalPages,
  } = useSearchAndPagination(users);

  return (
    <Box className="table-container">
      <div className="table-options">
        <FormControlLabel
          control={
            <Switch
              checked={dense}
              onChange={(e) => setDense(e.target.checked)}
            />
          }
          label="Dense padding"
        />
        <Button variant="contained" onClick={() => showUserPage()}>
          Add
        </Button>
        {showSearchBar && (
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        )}
      </div>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbar
          numSelected={selected.length}
          onToggleSearchBar={toggleSearchBar}
        />
        {loading ? (
          <Box display="flex" justifyContent="center" m={2}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" m={2} color="red">
            {error}
          </Box>
        ) : (
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <TableHeadr
                headCells={headCells}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={users.length}
              />
              <TableBody>
                {data.map((row: any, index: number) => {
                  const isItemSelected = selected.includes(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row._id.substring(0, 6)}
                      </TableCell>
                      <TableCell align="right">{row.username}</TableCell>
                      <TableCell align="right">{row.fullName}</TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.createdAt}</TableCell>
                      <TableCell
                        align="right"
                        sx={{ alignItems: "right" }}
                        colSpan={headCells.length}
                      >
                        <Button
                          sx={{ margin: "5px" }}
                          color="error"
                          variant="contained"
                          onClick={() => handleDeleteUser(row._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          sx={{ margin: "5px" }}
                          variant="contained"
                          onClick={() => showUserPage(row._id)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Pagination
          totalPages={totalPages}
          // tablePerPage={tablePerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalTable={users.length}
        />
      </Paper>
    </Box>
  );
}
