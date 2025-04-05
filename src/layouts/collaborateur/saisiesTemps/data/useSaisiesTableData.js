import { formatDate } from "functions/dateTime";
import { useMemo } from "react";
import { useFiltreSaisiesTempsQuery } from "store/api/saisieTemps";

export function useSaisiesTableData(collaborateurId, filters = {}) {
  const { startDate, endDate, page = 0, pageSize = 15 } = filters;

  // Calculer l'offset pour la pagination
  const offset = page * pageSize;

  // Appel à l'API avec pagination
  const {
    data = { saisies: [], total: 0 },
    isLoading,
    isFetching,
  } = useFiltreSaisiesTempsQuery(
    {
      collaborateurId,
      startDate,
      endDate,
      offset: offset,
      limit: pageSize,
    },
    {
      skip: !collaborateurId,
    }
  );

  // Récupérer les saisies et le total depuis la réponse
  const { saisies = [], total = 0 } = data;

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "heures", accessor: "heures", align: "center" },
      { Header: "commentaire", accessor: "commentaire", align: "center" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      saisies.map((saisie) => ({
        id: saisie.id,
        date: formatDate(saisie.date),
        heures: saisie.heures,
        commentaire: saisie.commentaire,
      })),
    [saisies]
  );

  return {
    columns,
    rows,
    isLoading: isLoading || isFetching,
    total,
  };
}
