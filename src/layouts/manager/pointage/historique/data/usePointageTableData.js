/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { formatTime } from "functions/dateTime";
import { formatDate } from "functions/dateTime";
import { useMemo } from "react";
import { useGetPointagesQuery } from "store/api/pointageApi";

export function usePointageTableData(managerId) {
  const { data: pointages = [], isLoading } = useGetPointagesQuery(managerId);

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "collaborateur", accessor: "collaborateur", align: "center" },
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
        collaborateur: `${pointage.collaborateur.nom} ${pointage.collaborateur.prenom}`,
        date: formatDate(pointage.date),
        heure_arrivee: formatTime(pointage.heure_arrivee),
        heure_depart: formatTime(pointage.heure_depart),
        status: pointage.status,
      })),
    [pointages]
  );

  return { columns, rows, isLoading };
}
