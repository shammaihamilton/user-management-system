import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchUsers, deleteUser } from "../redux/thunks/usersThunk";
import { notifyError, notifySuccess } from "../utils/tostify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";

interface UserContextType {
  handleDeleteUser: (ids: string | string[]) => void;
  handleSelectAllClick: (
    event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>
  ) => void;
  handleDeleteSelected: () => void;
  showUserPage: (id?: number) => void;
  error: any;
  users: Data[];
  headCells: readonly HeadCell[];
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);


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

  const handleDeleteUser = useCallback(
    async (ids: string | string[]) => {
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
        await Promise.all(
          ids.map((id: string) => dispatch(deleteUser(id)).unwrap())
        );
        notifySuccess("User deleted successfully!");
        await dispatch(fetchUsers()).unwrap();
      } catch (error) {
        console.error("Failed to delete user:", error);
        notifyError("Failed to delete user. Please try again.");
      }
    },
    [dispatch, users]
  );

  const handleSelectAllClick = useCallback(
    (
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
    },
    [users]
  );

  const handleDeleteSelected = useCallback(() => {
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

    dispatch(deleteUser(selected as any))
      .unwrap()
      .then(() => {
        dispatch(fetchUsers());
        notifySuccess("Users deleted successfully!");
      })
      .catch((error: any) => {
        notifyError("Failed to delete the users!");
        console.error("Error deleting users:", error);
      });

    setSelected([]);
  }, [dispatch, selected]);

  const showUserPage = useCallback(
    (id?: number): void => {
      if (id) {
        navigate(`/user/edit/${id}`);
        return;
      }
      navigate("/user/add");
    },
    [navigate]
  );

  const values = React.useMemo(
    () => ({
      handleDeleteUser,
      handleSelectAllClick,
      handleDeleteSelected,
      showUserPage,
      error,
      users,
      headCells,
      selected,
      setSelected,
      loading,
    }),
    [
      handleDeleteUser,
      handleSelectAllClick,
      handleDeleteSelected,
      showUserPage,
      error,
      users,
      headCells,
      selected,
      setSelected,
      loading,
    ]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a TableProvider");
  }
  return context;
};
