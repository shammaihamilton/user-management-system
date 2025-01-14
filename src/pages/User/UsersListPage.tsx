import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import "./userslistpage.scss";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Data,
  Order,
  HeadCell,
  EnhancedTableToolbar,
  EnhancedTableHead,
} from "../../components/table/TableHeader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchUsers, deleteUser } from "../../redux/thunks/usersThunk";
import { useEffect } from "react";
import { getToken } from "../../api/apiRequest";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells: readonly HeadCell[] = [
  {
    id: "_id",
    numeric: false,
    disablePadding: true,
    label: "user ID",
  },
  {
    id: "username",
    numeric: true,
    disablePadding: false,
    label: "User Name",
  },
  {
    id: "fullName",
    numeric: true,
    disablePadding: false,
    label: "Full Name",
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email ",
  },
  {
    id: "createdAt",
    numeric: true,
    disablePadding: false,
    label: "Create At",
  },
];

export default function EnhancedTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: any) => state.users);

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("_id");
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {
    const token = getToken();
    console.log("token: ", token);
    if (!token) {
      console.error("No authentication token found");
      navigate("/login");
      return;
    }
    dispatch(fetchUsers())
      .unwrap()
      .catch((error) => {
        console.error("Failed to fetch users:", error);
        if (error.message?.includes("403")) {
          navigate("/login");
          console.log(error);
        }
      });
  }, [dispatch, navigate]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };



  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const handleDeleteUser = async (ids: string | string[]) => {
    if (!Array.isArray(ids)) ids = [ids]; // Convert single ID to an array

    if (ids.length > 1) {
      // alert("You can delete up to 5 users at a time.");
      return;
    }
    const user = users.find((u: any) => u._id === ids[0]);
    if (!user) {
      alert("User not found.");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.username} user(s)?`
    );
    if (!confirmed) return;

    try {
      await Promise.all(ids.map((id) => dispatch(deleteUser(id)).unwrap()));
      alert("User deleted successfully.");
      await dispatch(fetchUsers()).unwrap(); // Refresh the user list
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>) => {
    if ('checked' in event.target) {
      const target = (event.target as HTMLInputElement).checked;
      const newSelected = users.map((n: any) => n._id);
  
      if (target) {
        setSelected(newSelected);
      } else {
        setSelected([]);
      }
    }
  };
  
  const handleDeleteSelected = () => {
    if (selected.length === 0) {
      alert("No users selected for deletion.");
      return;
    }
    if (selected.length > 5) {
      alert("You can only delete up to 5 users at once.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selected.length} selected users?`
    );
    if (!confirmDelete) return;

    // Dispatch the deletion
    dispatch(deleteUser(selected as any))
      .unwrap()
      .then(() => {
        dispatch(fetchUsers());
      })
      .catch((error) => {
        console.error("Error deleting users:", error);
      });

    setSelected([]); 
  };

  function showUserPage(id?: number): void {
    if (id) {
      navigate(`/user/edit/${id}`);
      return;
    }
    navigate("/user/add");
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...users]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, users]
  );

  return (
    <Box className="table-container">
      <div className="table-options">
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
        <Button variant="contained" onClick={() => showUserPage()}>Add</Button>
      </div>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length}
         onDelete={handleDeleteSelected}
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
              <EnhancedTableHead
                headCells={headCells}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={users.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
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
                        {row._id}
                      </TableCell>
                      <TableCell align="right">{row.username}</TableCell>
                      <TableCell align="right">{row.fullName}</TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.createdAt}</TableCell>
                      <TableCell align="right">
                        <Button variant="contained" onClick={() => handleDeleteUser(row._id)}>
                          Delete
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <Button variant="contained" onClick={() => showUserPage(row._id)}>
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
