import { formatDate } from "functions/dateTime";
import { useMemo } from "react";
import { useFiltreSaisiesTempsQuery } from "store/api/saisieTemps";

export function useSaisiesTableData(managerId, filters = {}) {
  const { startDate, endDate, collaborateurId, page = 0, pageSize = 25 } = filters;

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
      collaborateurId,
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
      { Header: "date", accessor: "date", align: "center" },
      { Header: "heures", accessor: "heures", align: "center" },
      { Header: "commentaire", accessor: "commentaire", align: "center" },
      { Header: "collaborateur", accessor: "collaborateur", align: "center" },
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

  // Fonction pour changer de page
  const handlePageChange = (newPage) => {
    // Cette fonction est appelée par le composant parent
    // Les changements d'état sont gérés dans le composant parent
  };

  // Fonction pour changer le nombre d'éléments par page
  const handlePageSizeChange = (newPageSize) => {
    // Cette fonction est appelée par le composant parent
    // Les changements d'état sont gérés dans le composant parent
  };

  return {
    columns,
    rows,
    isLoading: isLoading || isFetching,
    total,
    handlePageChange,
    handlePageSizeChange,
  };
}
