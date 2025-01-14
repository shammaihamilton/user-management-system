import { Navigate } from "react-router-dom";



const PrivateRoute = ({ isAuth, children }: { isAuth: boolean, children: JSX.Element }) => {
    return isAuth ? children : <Navigate to="/login" replace />;
  };


export default PrivateRoute;