import { useMemo, useState } from "react";
import { Data, Order } from "../context/useUserContext";
import { getComparator } from "../utils/tableUtils";


interface UseTableStateProps {
  users: Data[];
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

export function useTableState({ users, selected, setSelected }: UseTableStateProps) {

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("_id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = users.map((user) => user._id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((selectedId) => selectedId !== id);
    }

    setSelected(newSelected);
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const visibleRows = useMemo(
    () =>
      [...users]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, users]
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  return {
    order,
    orderBy,
    page,
    rowsPerPage,
    dense,
    setDense,
    visibleRows,
    emptyRows,
    handleRequestSort,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChangeDense,
    handleClick,
    handleSelectAllClick,
  };
}
