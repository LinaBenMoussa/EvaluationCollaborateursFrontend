import MDButton from "components/MDButton";
import { useCallback, useMemo } from "react";
import { useGetIssuesQuery } from "store/api/issueApi";
import { useNavigate } from "react-router-dom";
import { formatDateWithTime } from "functions/dateTime";
import { useGetIssuesByCollaborateurQuery } from "store/api/issueApi";

// Fonction pour formater la date

export function useIssuesTableData(idCollaborateur) {
  const { data: issues = [], isLoading } = useGetIssuesByCollaborateurQuery(idCollaborateur);
  const navigate = useNavigate();
  const navigateToSaisie = useCallback((id) => navigate(`/saisie/${id}`), [navigate]);

  const statusColors = {
    Terminé: "green",
    "En cours": "orange",
    "En retard": "red",
    "À faire": "gray",
  };
  const statusTranslations = {
    New: "Nouveau",
    Resolved: "Résolu",
    Closed: "Fermé",
    Reopened: "Réouvert",
    Assigned: "Assigné",
    Rejected: "Rejeté",
    Deffered: "Reporté",
    Duplicate: "Dupliqué",
    Ambiguous: "Ambigu",
    "in progress": "En cours",
    open: "Ouvert",
    "Négociation Offre": "Négociation de l'offre",
    "Validation Offre.": "Validation de l'offre",
    "clôture provisoire": "Clôture provisoire",
  };

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "sujet", accessor: "sujet", align: "center" },
      { Header: "description", accessor: "description", align: "center" },
      { Header: "type", accessor: "type", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "date_début", accessor: "date_debut", align: "center" },
      { Header: "date_écheance", accessor: "date_echeance", align: "center" },
      { Header: "date_fin", accessor: "date_fin", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      issues.map((issue) => {
        const translatedStatus = statusTranslations[issue.status?.name] || issue.status?.name;

        return {
          id: issue.id,
          sujet: issue.sujet,
          description: issue.description,
          type: issue.type,
          status: (
            <>
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: statusColors[translatedStatus] || "black",
                  marginRight: 5,
                }}
              />
              {translatedStatus}
            </>
          ),
          date_debut: formatDateWithTime(issue.date_debut),
          date_echeance: formatDateWithTime(issue.date_echeance),
          date_fin: formatDateWithTime(issue.date_fin),
          action: <MDButton onClick={() => navigateToSaisie(issue.id)}>Saisies</MDButton>,
        };
      }),
    [issues, navigateToSaisie]
  );

  return { columns, rows, isLoading };
}
