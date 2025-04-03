import { formatTime, formatDate } from "functions/dateTime";
import { useMemo } from "react";
import { useFiltrePointagesQuery } from "store/api/pointageApi";

export function usePointageTableData(managerId, filters = {}) {
  const { startDate, endDate, collaborateurId, page = 0, pageSize = 10 } = filters;

  // Calculer l'offset pour la pagination
  const offset = page * pageSize;

  // Appel à l'API avec pagination
  const {
    data = { pointages: [], total: 0 },
    isLoading,
    isFetching,
  } = useFiltrePointagesQuery(
    {
      managerId,
      startDate,
      endDate,
      ...(collaborateurId !== null && { collaborateurId }),
      offset: offset,
      limit: pageSize,
    },
    {
      skip: !managerId,
    }
  );

  // Récupérer les pointages et le total depuis la réponse
  const { pointages = [], total = 0 } = data;

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "collaborateur", accessor: "collaborateur", align: "center" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "heure_arrivee", accessor: "heure_arrivee", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "heure_depart", accessor: "heure_depart", align: "center" },
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
        status: pointage.heure_depart ? "A quité" : "En poste",
      })),
    [pointages]
  );

  return {
    columns,
    rows,
    isLoading: isLoading || isFetching,
    total,
  };
}
