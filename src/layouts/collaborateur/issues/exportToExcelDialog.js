/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Divider,
  Box,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { exportToExcel } from "functions/exportToExcel";
import { useFiltreIssuesQuery } from "store/api/issueApi";
import { formatDateWithTime } from "functions/dateTime";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import MDButton from "components/MDButton";

// Import the status translations and colors from your hook
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

const DATE_FILTER_TYPES = {
  DATE_DEBUT: "debut",
  DATE_ECHEANCE: "echeance",
  DATE_FIN: "fin",
};

const ExcelExportDialog = ({ open, onClose, fileName, statusOptions, columns }) => {
  // Filter states
  const collaborateurId = useSelector(selectCurrentUser);
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [activeTab, setActiveTab] = useState(0);
  const [exportLimit, setExportLimit] = useState(100);
  // Date filters for different periods
  const [filterStartDateDebut, setFilterStartDateDebut] = useState("");
  const [filterEndDateDebut, setFilterEndDateDebut] = useState("");

  const [filterStartDateEcheance, setFilterStartDateEcheance] = useState("");
  const [filterEndDateEcheance, setFilterEndDateEcheance] = useState("");

  const [filterStartDateFin, setFilterStartDateFin] = useState("");
  const [filterEndDateFin, setFilterEndDateFin] = useState("");

  const [selectedColumns, setSelectedColumns] = useState(() => {
    if (columns.length > 0) {
      const columnKeys = columns.map((col) => col.accessor).filter((key) => key !== "action");
      return columnKeys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
    }
    return {};
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Prepare query parameters
  const queryParams = {
    collaborateurId: collaborateurId,
    startDateDebut: filterStartDateDebut || undefined,
    endDateDebut: filterEndDateDebut || undefined,
    startDateEcheance: filterStartDateEcheance || undefined,
    endDateEcheance: filterEndDateEcheance || undefined,
    startDateFin: filterStartDateFin || undefined,
    endDateFin: filterEndDateFin || undefined,
    status: filterStatus !== "Tous" ? STATUS_TRANSLATIONS_REVERSE[filterStatus] : undefined,
    limit: exportLimit,
    offset: 0,
  };

  // Use the RTK Query hook
  const { data, isLoading, isFetching } = useFiltreIssuesQuery(queryParams, {
    skip: !open || !collaborateurId, // Only fetch when dialog is open and collaborateurId is provided
  });

  // Format the fetched data similar to rows in useIssuesTableData
  const formattedData = React.useMemo(() => {
    if (!data || !data.issues) return [];

    return data.issues.map((issue) => {
      const translatedStatus = STATUS_TRANSLATIONS[issue.status?.name] || issue.status?.name;

      return {
        id: issue.id,
        sujet: issue.sujet,
        description: issue.description,
        type: issue.type,
        status: translatedStatus, // Using the translated status directly as a string
        date_debut: formatDateWithTime(issue.date_debut),
        date_echeance: formatDateWithTime(issue.date_echeance),
        date_fin: formatDateWithTime(issue.date_fin),
        collaborateur: issue.collaborateur
          ? `${issue.collaborateur.nom} ${issue.collaborateur.prenom}`
          : "",
        // Exclude the action field as it's not needed for export
      };
    });
  }, [data]);

  // Handle column selection
  const handleColumnChange = (column) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Get the filtered data for export
  const getFilteredData = () => {
    if (!formattedData || formattedData.length === 0) return [];

    // Filter columns based on selection
    return formattedData.map((row) => {
      const filteredRow = {};
      Object.keys(row).forEach((key) => {
        if (selectedColumns[key] && key !== "action") {
          filteredRow[key] = row[key];
        }
      });
      return filteredRow;
    });
  };

  // Handle export button click
  const handleExport = () => {
    const dataToExport = getFilteredData();
    exportToExcel(dataToExport, fileName);
    onClose();
  };

  // Update export limit when data changes
  useEffect(() => {
    if (data && data.issues && data.issues.length > 0) {
      setExportLimit((prev) => Math.min(prev, data.issues.length));
    }
  }, [data]);

  // Render date filter inputs based on active tab
  const renderDateFilters = () => {
    switch (activeTab) {
      case 0: // Date de début
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date début (à partir de)"
                type="date"
                fullWidth
                size="small"
                value={filterStartDateDebut}
                onChange={(e) => setFilterStartDateDebut(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date début (jusqu'à)"
                type="date"
                fullWidth
                size="small"
                value={filterEndDateDebut}
                onChange={(e) => setFilterEndDateDebut(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </>
        );
      case 1: // Date d'échéance
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date échéance (à partir de)"
                type="date"
                fullWidth
                size="small"
                value={filterStartDateEcheance}
                onChange={(e) => setFilterStartDateEcheance(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date échéance (jusqu'à)"
                type="date"
                fullWidth
                size="small"
                value={filterEndDateEcheance}
                onChange={(e) => setFilterEndDateEcheance(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </>
        );
      case 2: // Date de fin
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date fin (à partir de)"
                type="date"
                fullWidth
                size="small"
                value={filterStartDateFin}
                onChange={(e) => setFilterStartDateFin(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date fin (jusqu'à)"
                type="date"
                fullWidth
                size="small"
                value={filterEndDateFin}
                onChange={(e) => setFilterEndDateFin(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Exporter en Excel</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Filters section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              {"Filtres d'exportation"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="export-status-label">Statut</InputLabel>
              <Select
                labelId="export-status-label"
                value={filterStatus}
                label="Statut"
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{ height: 40 }}
              >
                <MenuItem value="Tous">Tous les statuts</MenuItem>
                {statusOptions?.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Row limit */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Nombre de lignes à exporter"
              type="number"
              fullWidth
              size="small"
              value={exportLimit}
              onChange={(e) => setExportLimit(Math.max(1, parseInt(e.target.value) || 0))}
              InputProps={{
                inputProps: {
                  min: 1,
                  max: data?.issues?.length || 100,
                },
              }}
              helperText={data?.issues ? `Maximum: ${data.issues.length} lignes` : "Chargement..."}
            />
          </Grid>

          {/* Date filter tabs */}
          <Grid item xs={12}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
            >
              <Tab label="Date de début" />
              <Tab label="Date d'échéance" />
              <Tab label="Date de fin" />
            </Tabs>
          </Grid>

          {/* Date range fields based on selected tab */}
          {renderDateFilters()}

          {/* Column selection */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mt: 2 }}>
              Colonnes à exporter
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={1}>
              {Object.keys(selectedColumns).map((column) => (
                <Grid item xs={6} sm={4} md={3} key={column}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedColumns[column]}
                        onChange={() => handleColumnChange(column)}
                        size="small"
                      />
                    }
                    label={columns.find((col) => col.accessor === column)?.Header || column}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Loading indicator */}
          {(isLoading || isFetching) && (
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Chargement des données...
              </Typography>
            </Grid>
          )}

          {/* Data preview/summary */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="body2">
              {data?.issues
                ? `${data.issues.length} enregistrements trouvés`
                : "Aucune donnée disponible"}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <MDButton onClick={onClose}>Annuler</MDButton>
        <MDButton
          variant="contained"
          color="info"
          onClick={handleExport}
          disabled={
            isLoading ||
            isFetching ||
            !formattedData ||
            formattedData.length === 0 ||
            Object.values(selectedColumns).every((v) => !v)
          }
        >
          Exporter
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default ExcelExportDialog;
