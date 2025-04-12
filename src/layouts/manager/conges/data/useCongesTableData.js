import { useMemo } from "react";
import { formatDate, formatTime } from "functions/dateTime";
import { useFiltreCongesQuery } from "store/api/congeApi";
import { Chip } from "@mui/material";

export function useCongesTableData(managerId, filters = {}) {
  const {
    startDateDebut,
    endDateDebut,
    startDateFin,
    endDateFin,
    collaborateurId,
    type,
    page = 0,
    pageSize = 10,
  } = filters;

  // Calculer l'offset pour la pagination
  const offset = page * pageSize;

  // Appel à l'API avec pagination
  const {
    data = { conges: [], total: 0 },
    isLoading,
    isFetching,
  } = useFiltreCongesQuery(
    {
      managerId,
      startDateDebut,
      endDateDebut,
      startDateFin,
      endDateFin,
      ...(collaborateurId !== null && { collaborateurId }),
      type: type !== "Tous" ? type : undefined,
      offset,
      limit: pageSize,
    },
    {
      skip: !managerId,
    }
  );

  const { conges = [], total = 0 } = data;

  // Colors for types
  const TYPE_COLORS = {
    "Congé annuel": "#4CAF50", // Green
    Autorisation: "#2196F3", // Blue
  };

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id", align: "left", width: "50px" },
      { Header: "Collaborateur", accessor: "collaborateur", align: "left", width: "200px" },
      { Header: "Type", accessor: "type", align: "left", width: "150px" },
      { Header: "Date début", accessor: "dateDebut", align: "left" },
      { Header: "Date fin", accessor: "dateFin", align: "left" },
      { Header: "Nombre de jours", accessor: "nbrjour", align: "left" },
      { Header: "Heure début", accessor: "heureDeb", align: "left" },
      { Header: "Heure fin", accessor: "heureFin", align: "left" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      conges.map((conge) => ({
        id: conge.id,
        collaborateur: `${conge.collaborateur.nom} ${conge.collaborateur.prenom}`,
        type: (
          <Chip
            label={conge.type === "A" ? "Autorisation" : "Congé annuel"}
            size="small"
            sx={{
              backgroundColor:
                conge.type === "A" ? TYPE_COLORS.Autorisation : TYPE_COLORS["Congé annuel"],
              color: "#FFF",
              fontWeight: "bold",
              "& .MuiChip-label": { px: 1 },
            }}
          />
        ),
        dateDebut: formatDate(conge.dateDebut),
        dateFin: formatDate(conge.dateFin),
        nbrjour: conge.nbrjour,
        heureDeb: formatTime(conge.heureDeb),
        heureFin: formatTime(conge.heureFin),
      })),
    [conges]
  );

  return {
    columns,
    rows,
    isLoading: isLoading || isFetching,
    total,
  };
}
