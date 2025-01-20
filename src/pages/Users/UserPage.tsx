import React from "react";
import { TableProvider } from "../../context/useUserContext";
import Table from "../../components/usersTable/Table";

const UserPage: React.FC = () => {
  return (
    <TableProvider>
      <Table />
    </TableProvider>
  );
};

export default UserPage;
