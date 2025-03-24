import { formatDate } from "functions/dateTime";
import { formatTime } from "functions/dateTime";
import { formatDateWithTime } from "functions/dateTime";
import { useMemo } from "react";
import { useGetCongesByCollaborateurQuery } from "store/api/congeApi";
import { useGetCongesQuery } from "store/api/congeApi";

// Fonction pour formater la date

export function useCongesTableData(idCollaborateur) {
  const { data: conges = [], isLoading } = useGetCongesByCollaborateurQuery(idCollaborateur);

  const statusColors = {
    Terminé: "green",
    "En cours": "orange",
    Bloqué: "red",
    "À faire": "gray",
  };

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "type", accessor: "type", align: "center" },
      { Header: "date_debut", accessor: "date_debut", align: "center" },
      { Header: "date_fin", accessor: "date_fin", align: "center" },
      { Header: "nombre des jours", accessor: "nbrjour", align: "center" },
      { Header: "heureDeb", accessor: "heureDeb", align: "center" },
      { Header: "heureFin", accessor: "heureFin", align: "center" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      conges.map((conge) => ({
        id: conge.id,
        type: conge.type === "A" ? "Autorisation" : "Congé annuel",
        date_debut: formatDate(conge.date_debut),
        date_fin: formatDate(conge.date_fin),
        nbrjour: conge.nbrjour,
        heureFin: formatTime(conge.heureFin),
        heureDeb: formatTime(conge.heureDeb),
      })),
    [conges]
  );

  return { columns, rows, isLoading };
}
