import { Navigate, Outlet, RouteObject } from "react-router-dom";
import Root from "../Root";
import Home from "../pages/Home";
import Login from "../pages/Login";
// import Users from "../pages/Users/oldTable/UsersListPage";
import UsersPage from "../pages/Users/UserPage";
import PrivateRoute from "./PrivateRoute";
import UserFormPage from "../pages/UserFormPage";
import Todo from "../pages/Todo";

interface RouteConfig {
  isAuth: boolean;
}

const routes = ({ isAuth }: RouteConfig): RouteObject[] => [
  {
    path: "/",
    element: <Root isAuth={isAuth} />,
    children: [
      {
        index: true,
        element: isAuth ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />,
      },
      { path: "login", element: isAuth ? <Navigate to="/home" replace /> : <Login /> },
      {
        element: (
          <PrivateRoute isAuth={isAuth}>
            <Outlet />
          </PrivateRoute>
        ),
        children: [
          { path: "home", element: <Home /> },
          // { path: "users", element: <Users /> },
          { path: "usersPage", element: <UsersPage /> },
          { path: "todo", element: <Todo /> },
          { path: "user/add", element: <UserFormPage /> }, 
          { path: "user/edit/:id", element: <UserFormPage /> },

        ],
      },
    ],
  },
];

export default routes;
