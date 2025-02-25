import MDButton from "components/MDButton";
import { useCallback, useMemo } from "react";
import { useGetIssuesQuery } from "store/api/issueApi";
import { useNavigate } from "react-router-dom";
import { formatDateWithTime } from "functions/dateTime";

// Fonction pour formater la date

export function useIssuesTableData(idManager) {
  const { data: issues = [], isLoading } = useGetIssuesQuery(idManager);
  const navigate = useNavigate();
  const navigateToSaisie = useCallback((id) => navigate(`/saisie/${id}`), [navigate]);

  const statusColors = {
    Terminé: "green",
    "En cours": "orange",
    "En retard": "red",
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
      { Header: "action", accessor: "action", align: "center" },
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
        date_debut: formatDateWithTime(issue.date_debut),

        date_echeance: formatDateWithTime(issue.date_echeance),
        date_fin: formatDateWithTime(issue.date_fin),
        collaborateur: `${issue.collaborateur.nom} ${issue.collaborateur.prenom}`,
        action: <MDButton onClick={() => navigateToSaisie(issue.id)}>Saisies</MDButton>,
      })),
    [issues]
  );

  return { columns, rows, isLoading };
}
