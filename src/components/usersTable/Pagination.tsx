import React from "react";
import { Box, Button, Pagination as MuiPagination, Typography } from "@mui/material";

interface MuiPaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalTable: number;
  totalPages: number;
}


export const Pagination: React.FC<MuiPaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalTable,
  totalPages,
}) => {


  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={3} sx={{ padding: "20px" }}>
      <Box display="flex" gap={2} alignItems="center">
      <Typography variant="body2" sx={{ mr: 2 }}>
          {`Showing ${totalTable}`}
        </Typography>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {`Page ${currentPage} of ${totalPages}`}
        </Typography>

        <Button
          variant="contained"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
        >
          First
        </Button>
        <Button
          variant="contained"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          &laquo;
        </Button>
        <MuiPagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </Button>
        <Button
          variant="contained"
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
        >
          Last
        </Button>
      </Box>
    </Box>
  );
};
