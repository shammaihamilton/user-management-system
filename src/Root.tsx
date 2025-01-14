import { Suspense, FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/header/header/header";

interface RootProps {
  isAuth: boolean;
}

const Root: FC<RootProps> = ({ isAuth }) => {
  return (
    <div>
      {isAuth && <Header />}
      <Suspense fallback={<div>Loading...</div>}>
        <div>
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
};

export default Root;