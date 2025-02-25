import { formatDateWithTime } from "functions/dateTime";
import { useMemo } from "react";
import { useGetCongesQuery } from "store/api/congeApi";

// Fonction pour formater la date

export function useCongesTableData(idManager) {
  const { data: conges = [], isLoading } = useGetCongesQuery(idManager);

  const statusColors = {
    Terminé: "green",
    "En cours": "orange",
    Bloqué: "red",
    "À faire": "gray",
  };

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "collaborateur", accessor: "collaborateur", align: "center" },
      { Header: "type", accessor: "type", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "commentaire", accessor: "commentaire", align: "center" },
      { Header: "date_demande", accessor: "date_demande", align: "center" },
      { Header: "date_debut", accessor: "date_debut", align: "center" },
      { Header: "date_fin", accessor: "date_fin", align: "center" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      conges.map((conge) => ({
        id: conge.id,
        collaborateur: `${conge.collaborateur.nom} ${conge.collaborateur.prenom}`,
        type: conge.type,
        status: conge.status,
        date_demande: formatDateWithTime(conge.date_demande),
        date_debut: formatDateWithTime(conge.date_debut),
        date_fin: formatDateWithTime(conge.date_fin),
        commentaire: conge.commentaire,
      })),
    [conges]
  );

  return { columns, rows, isLoading };
}
