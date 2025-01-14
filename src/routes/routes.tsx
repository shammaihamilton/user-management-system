import { Navigate, Outlet, RouteObject } from "react-router-dom";
import Root from "../Root";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Users from "../pages/User/UsersListPage";
import PrivateRoute from "./PrivateRoute";
import UserFormPage from "../pages/UserFormPage";

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
          { path: "users", element: <Users /> },
          { path: "user/add", element: <UserFormPage /> }, 
          { path: "user/edit/:id", element: <UserFormPage /> },

        ],
      },
    ],
  },
];

export default routes;
