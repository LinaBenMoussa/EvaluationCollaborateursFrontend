import { useMemo } from "react";
import { useGetIssuesQuery } from "store/api/issueApi";

// Fonction pour formater la date
function formatDate(date) {
  if (date == null) {
    return "";
  }
  const d = new Date(date);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function useIssuesTableData(idManager) {
  const { data: issues = [], isLoading } = useGetIssuesQuery(idManager);

  const statusColors = {
    Terminé: "green",
    "En cours": "orange",
    Bloqué: "red",
    "À faire": "gray",
  };

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "titre", accessor: "titre", align: "center" },
      { Header: "type", accessor: "type", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "date_début", accessor: "date_debut", align: "center" },
      { Header: "date_écheance", accessor: "date_echeance", align: "center" },
      { Header: "date_fin", accessor: "date_fin", align: "center" },
      { Header: "collaborateur", accessor: "collaborateur", align: "center" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      issues.map((issue) => ({
        id: issue.id,
        titre: issue.titre,
        type: issue.type,
        status: (
          <>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: statusColors[issue.status] || "black",
                marginRight: 5,
              }}
            />
            {issue.status}
          </>
        ),
        date_debut: formatDate(issue.date_debut),

        date_echeance: formatDate(issue.date_echeance),
        date_fin: formatDate(issue.date_fin),
        collaborateur: `${issue.collaborateur.nom} ${issue.collaborateur.prenom}`,
      })),
    [issues]
  );

  return { columns, rows, isLoading };
}
