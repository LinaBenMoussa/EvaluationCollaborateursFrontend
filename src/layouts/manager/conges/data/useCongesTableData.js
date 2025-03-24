import { formatDate } from "functions/dateTime";
import { formatTime } from "functions/dateTime";
import { formatDateWithTime } from "functions/dateTime";
import { useMemo } from "react";
import { useGetCongesQuery } from "store/api/congeApi";

// Fonction pour formater la date

export function useCongesTableData(idManager) {
  const { data: conges = [], isLoading } = useGetCongesQuery(idManager);
  console.log("conges", conges);

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
      { Header: "date_debut", accessor: "dateDebut", align: "center" },
      { Header: "date_fin", accessor: "dateFin", align: "center" },
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
        collaborateur: `${conge.collaborateur.nom} ${conge.collaborateur.prenom}`,

        type: conge.type === "A" ? "Autorisation" : "Congé annuel",
        dateDebut: formatDate(conge.dateDebut),
        dateFin: formatDate(conge.dateFin),
        nbrjour: conge.nbrjour,
        heureFin: formatTime(conge.heureFin),
        heureDeb: formatTime(conge.heureDeb),
      })),
    [conges]
  );

  return { columns, rows, isLoading };
}
