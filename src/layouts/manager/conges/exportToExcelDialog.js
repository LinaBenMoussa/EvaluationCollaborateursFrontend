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
import { useFiltreCongesQuery } from "store/api/congeApi";
import { formatDate, formatTime } from "functions/dateTime";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import MDButton from "components/MDButton";

// Define type translations
const TYPE_TRANSLATIONS = {
  A: "Autorisation",
  C: "Congé annuel",
};

const CongeExcelExportDialog = ({ open, onClose, fileName, typeOptions, columns }) => {
  // Filter states
  const managerId = useSelector(selectCurrentUser);
  const [filterType, setFilterType] = useState("Tous");
  const [activeTab, setActiveTab] = useState(0);
  const [exportLimit, setExportLimit] = useState(100); // Default limit

  // Date filters for different periods
  const [filterStartDateDebut, setFilterStartDateDebut] = useState("");
  const [filterEndDateDebut, setFilterEndDateDebut] = useState("");

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
    managerId: managerId,
    startDateDebut: filterStartDateDebut || undefined,
    endDateDebut: filterEndDateDebut || undefined,
    startDateFin: filterStartDateFin || undefined,
    endDateFin: filterEndDateFin || undefined,
    type: filterType !== "Tous" ? filterType : undefined,
    limit: exportLimit,
    offset: 0,
    collaborateurId: undefined,
  };

  // Use the RTK Query hook
  const { data, isLoading, isFetching } = useFiltreCongesQuery(queryParams, {
    skip: !open || !managerId, // Only fetch when dialog is open and managerId is provided
  });

  // Format the fetched data similar to rows in useCongesTableData
  const formattedData = React.useMemo(() => {
    if (!data || !data.conges) return [];

    return data.conges.map((conge) => {
      return {
        id: conge.id,
        collaborateur: `${conge.collaborateur.nom} ${conge.collaborateur.prenom}`,
        type: conge.type === "A" ? "Autorisation" : "Congé annuel",
        dateDebut: formatDate(conge.dateDebut),
        dateFin: formatDate(conge.dateFin),
        nbrjour: conge.nbrjour,
        heureDeb: formatTime(conge.heureDeb),
        heureFin: formatTime(conge.heureFin),
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
    if (data && data.conges && data.conges.length > 0) {
      setExportLimit((prev) => Math.min(prev, data.conges.length));
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
      case 1: // Date de fin
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

          {/* Type filter */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="export-type-label">Type</InputLabel>
              <Select
                labelId="export-type-label"
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
                sx={{ height: 45 }}
              >
                <MenuItem value="Tous">Tous les types</MenuItem>
                <MenuItem value="A">Autorisation</MenuItem>
                <MenuItem value="C">Congé annuel</MenuItem>
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
                  max: data?.conges?.length || 100,
                },
              }}
              helperText={data?.conges ? `Maximum: ${data.conges.length} lignes` : "Chargement..."}
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
              {data?.conges
                ? `${data.conges.length} enregistrements trouvés`
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

export default CongeExcelExportDialog;
