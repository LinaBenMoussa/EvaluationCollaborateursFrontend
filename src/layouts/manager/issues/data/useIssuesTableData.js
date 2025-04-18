import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatDateWithTime } from "functions/dateTime";
import { useTheme } from "@mui/material/styles";
import MDButton from "components/MDButton";
import { Chip } from "@mui/material";
import { useFiltreIssuesQuery } from "store/api/issueApi";

// Status colors mapping
const STATUS_COLORS = {
  Nouveau: "#2196F3",
  Résolu: "#4CAF50",
  Fermé: "#607D8B",
  Réouvert: "#FF9800",
  Assigné: "#9C27B0",
  Rejeté: "#F44336",
  Reporté: "#795548",
  Dupliqué: "#9E9E9E",
  Ambigu: "#FFEB3B",
  "En cours": "#00BCD4",
  Ouvert: "#8BC34A",
  "Négociation de l'offre": "#673AB7",
  "Validation de l'offre": "#3F51B5",
  "Clôture provisoire": "#E91E63",
};

// Translation dictionary for statuses
const STATUS_TRANSLATIONS = {
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
const STATUS_TRANSLATIONS_REVERSE = {
  Nouveau: "New",
  Résolu: "Resolved",
  Fermé: "Closed",
  Réouvert: "Reopened",
  Assigné: "Assigned",
  Rejeté: "Rejected",
  Reporté: "Deffered",
  Dupliqué: "Duplicate",
  Ambigu: "Ambiguous",
  "En cours": "in progress",
  Ouvert: "open",
  "Négociation de l'offre": "Négociation Offre",
  "Validation de l'offre": "Validation Offre.",
  "Clôture provisoire": "clôture provisoire",
};

export function useIssuesTableData(managerId, filters = {}) {
  const {
    startDateDebut,
    endDateDebut,
    startDateEcheance,
    endDateEcheance,
    startDateFin,
    endDateFin,
    collaborateurId,
    status,
    page = 0,
    pageSize = 10,
  } = filters;

  const offset = page * pageSize;
  const theme = useTheme();
  const navigate = useNavigate();

  // Fetch data with API filters and pagination
  const {
    data = { issues: [], total: 0 },
    isLoading,
    isFetching,
  } = useFiltreIssuesQuery(
    {
      managerId,
      startDateDebut,
      endDateDebut,
      startDateEcheance,
      endDateEcheance,
      startDateFin,
      endDateFin,
      ...(collaborateurId !== null && { collaborateurId }),
      status: status !== "Tous" ? STATUS_TRANSLATIONS_REVERSE[status] : undefined,
      offset,
      limit: pageSize,
    },
    {
      skip: !managerId,
    }
  );

  const { issues = [], total = 0 } = data;
  const navigateToSaisie = useCallback((id) => navigate(`/saisie/${id}`), [navigate]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id", align: "left", allowWrap: true },
      { Header: "Sujet", accessor: "sujet", align: "left", allowWrap: true, width: "200px" },
      {
        Header: "Description",
        accessor: "description",
        align: "left",
        allowWrap: true,
        width: "500px",
      },
      { Header: "Type", accessor: "type", align: "left", allowWrap: true },
      { Header: "Statut", accessor: "status", align: "left", allowWrap: true },
      { Header: "Date début", accessor: "date_debut", align: "left", allowWrap: true },
      { Header: "Date échéance", accessor: "date_echeance", align: "left", allowWrap: true },
      { Header: "Date fin", accessor: "date_fin", align: "left", allowWrap: true },
      { Header: "Collaborateur", accessor: "collaborateur", align: "left", allowWrap: true },
      { Header: "Action", accessor: "action", align: "left", allowWrap: true },
    ],
    []
  );

  const rows = useMemo(
    () =>
      issues.map((issue) => {
        const translatedStatus = STATUS_TRANSLATIONS[issue.status?.name] || issue.status?.name;

        return {
          id: issue.id,
          sujet: issue.sujet,
          description: issue.description,
          type: issue.type,
          status: (
            <Chip
              label={translatedStatus}
              size="small"
              sx={{
                backgroundColor: STATUS_COLORS[translatedStatus] || theme.palette.grey[500],
                color: "#FFF",
                fontWeight: "bold",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          ),
          date_debut: formatDateWithTime(issue.date_debut),
          date_echeance: formatDateWithTime(issue.date_echeance),
          date_fin: formatDateWithTime(issue.date_fin),
          collaborateur: `${issue.collaborateur.nom} ${issue.collaborateur.prenom}`,
          action: (
            <MDButton
              onClick={() => navigateToSaisie(issue.id)}
              color="info"
              variant="outlined"
              size="small"
            >
              Saisies
            </MDButton>
          ),
        };
      }),
    [issues, navigateToSaisie, theme.palette.grey]
  );

  return {
    columns,
    rows,
    isLoading: isLoading || isFetching,
    total,
  };
}
