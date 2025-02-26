/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { formatTime } from "functions/dateTime";
import { formatDate } from "functions/dateTime";
import { useMemo } from "react";
import { useGetPointagesByCollaborateurQuery } from "store/api/pointageApi";

export function usePointageTableData(collaborateurId) {
  const { data: pointages = [], isLoading } = useGetPointagesByCollaborateurQuery(collaborateurId);

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

  const rows = useMemo(
    () =>
      pointages.map((pointage) => ({
        id: pointage.id,
        date: formatDate(pointage.date),
        heure_arrivee: formatTime(pointage.heure_arrivee),
        heure_depart: formatTime(pointage.heure_depart),
        status: pointage.status,
      })),
    [pointages]
  );

  return { columns, rows, isLoading };
}
