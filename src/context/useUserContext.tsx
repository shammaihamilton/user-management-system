import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../redux/thunks/usersThunk";
import { notifyError, notifySuccess } from "../utils/tostify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
// import { HeadCell } from "../components/usersTable/TableHeader";

const UserContext = createContext<any>(null);


export type Order = "asc" | "desc";
export interface Data {
  _id: number;
  username: string;
  fullName: string;
  email: string;
  createdAt: number;
}
export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
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

export const TableProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { users, error, loading } = useSelector((state: any) => state.users);
  const token = useSelector((state: any) => state.auth.token);
  const [selected, setSelected] = useState<number[]>([]);

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


  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        if (isMounted) {
          await dispatch(fetchUsers()).unwrap();
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, [dispatch, navigate, token]);
  

  const handleDeleteUser = async (ids: string | string[]) => {
    if (!Array.isArray(ids)) ids = [ids];

    if (!ids.length) {
      notifyError("No users selected.");
      return;
    }
    const user = users.find((u: any) => u._id === ids[0]);
    if (!user) {
      notifyError("User not found.");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.username} user?`
    );
    if (!confirmed) return;

    try {
      await Promise.all(ids.map((id : string) => dispatch(deleteUser(id)).unwrap()));
      notifySuccess("User deleted successfully!");
      await dispatch(fetchUsers()).unwrap();
    } catch (error) {
      console.error("Failed to delete user:", error);
      notifyError("Failed to delete user. Please try again.");
    }
  };
  const handleSelectAllClick = (
    event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>
  ) => {
    if ("checked" in event.target) {
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
      notifyError("No users selected for deletion.");
      return;
    }
    if (selected.length > 5) {
      notifyError("You can only delete up to 5 users at once.");
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
        notifySuccess("Users deleted successfully!");
      })
      .catch((error: any) => {
        notifyError("Failed to deleted the user!");
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

  const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<keyof Data>("_id");
  
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
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

  const values = {
    handleDeleteUser,
    handleSelectAllClick,
    handleDeleteSelected,
    showUserPage,
    error,
    users,
    headCells,
    selected,
    setSelected,
    getComparator,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    page,
    setPage,
    dense,
    setDense,
    rowsPerPage,
    setRowsPerPage,
    handleRequestSort,
    handleClick,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChangeDense,
    emptyRows,
    visibleRows,
    loading,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  return useContext(UserContext);
};
