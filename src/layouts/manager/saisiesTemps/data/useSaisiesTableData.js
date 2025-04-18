import { formatDate } from "functions/dateTime";
import { useMemo } from "react";
import { useFiltreSaisiesTempsQuery } from "store/api/saisieTemps";

export function useSaisiesTableData(managerId, filters = {}) {
  const { startDate, endDate, collaborateurId, page = 0, pageSize = 15 } = filters;

  // Calculer l'offset pour la pagination
  const offset = page * pageSize;

  // Appel à l'API avec pagination
  const {
    data = { saisies: [], total: 0 },
    isLoading,
    isFetching,
  } = useFiltreSaisiesTempsQuery(
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

  // Récupérer les saisies et le total depuis la réponse
  const { saisies = [], total = 0 } = data;

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "date", accessor: "date", align: "left" },
      { Header: "heures", accessor: "heures", align: "left" },
      { Header: "commentaire", accessor: "commentaire", align: "left" },
      { Header: "collaborateur", accessor: "collaborateur", align: "left" },
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
        collaborateur: `${saisie.collaborateur.nom} ${saisie.collaborateur.prenom}`,
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
