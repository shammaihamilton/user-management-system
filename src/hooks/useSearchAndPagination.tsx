import { useMemo, useState } from "react";
import { Data } from "../context/useUserContext";

export function useSearchAndPagination(users: Data[]) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const tablePerPage = 5; // Items per page

  const filteredData = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(
      (data) =>
        (data?.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (data?.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (data?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (data?.createdAt?.toString() || "").includes(searchTerm.toLowerCase()) ||
        (data?._id?.toString() || "").includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  const indexOfLastItem = currentPage * tablePerPage;
  const indexOfFirstItem = indexOfLastItem - tablePerPage;
  const currentList = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / tablePerPage);

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    currentList,
    totalPages,
    tablePerPage,
  };
}
