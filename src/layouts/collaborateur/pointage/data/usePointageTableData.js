import { useState } from "react";
import { formatTime } from "functions/dateTime";
import { formatDate } from "functions/dateTime";
import { useMemo } from "react";
import { useFiltrePointagesQuery } from "store/api/pointageApi";

export function usePointageTableData(collaborateurId, filterOptions = {}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const { status = "Tous", startDate = "", endDate = "" } = filterOptions;

  // Use the new filtrePointages query with pagination
  const { data = { pointages: [], total: 0 }, isLoading } = useFiltrePointagesQuery({
    collaborateurId,
    startDate,
    endDate,
    offset: page * rowsPerPage,
    limit: rowsPerPage,
  });

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "heure_arrivee", accessor: "heure_arrivee", align: "center" },
      { Header: "heure_depart", accessor: "heure_depart", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
    ],
    []
  );

  const { pointages = [], total = 0 } = data;

  const rows = useMemo(
    () =>
      pointages
        .map((pointage) => ({
          id: pointage.id,
          date: formatDate(pointage.date),
          heure_arrivee: formatTime(pointage.heure_arrivee),
          heure_depart: formatTime(pointage.heure_depart),
          status: pointage.status,
        }))
        .filter((row) => {
          // Client-side filtering as a fallback
          if (status === "Tous") return true;
          return status === "En poste" ? row.status === "En poste" : row.status === "A quité";
        }),
    [pointages, status]
  );

  // Pagination handlers
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  return {
    columns,
    rows,
    isLoading,
    pagination: {
      page,
      rowsPerPage,
      total,
      handleChangePage,
      handleChangeRowsPerPage,
    },
  };
}
