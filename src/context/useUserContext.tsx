import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../redux/thunks/usersThunk";
import { notifyError, notifySuccess } from "../utils/tostify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { HeadCell } from "../components/usersTable/TableHeader";

const UserContext = createContext<any>(null);

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
  const { users, error } = useSelector((state: any) => state.users);
  const token = useSelector((state: any) => state.auth.token);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!token) {
      console.error("No authentication token found");
      navigate("/login");
      return;
    }
    dispatch(fetchUsers())
      .unwrap()
      .catch((error: any) => {
        console.error("Failed to fetch users:", error);
        if (error.message?.includes("403")) {
          navigate("/login");
          console.log(error);
        }
      });
  }, [dispatch, navigate]);

  const handleDeleteUser = async (ids: string | string[]) => {
    if (!Array.isArray(ids)) ids = [ids]; // Convert single ID to an array

    if (ids.length > 1) {
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
      await Promise.all(ids.map((id) => dispatch(deleteUser(id)).unwrap()));
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
    order: "asc",
    orderBy: "_id",
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  return useContext(UserContext);
};
