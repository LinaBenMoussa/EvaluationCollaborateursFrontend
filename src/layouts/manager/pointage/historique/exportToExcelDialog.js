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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { exportToExcel } from "functions/exportToExcel";
import { useFiltrePointagesQuery } from "store/api/pointageApi";
import { formatDate, formatTime } from "functions/dateTime";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import MDButton from "components/MDButton";

const PointageExportDialog = ({ open, onClose, fileName, columns }) => {
  // Filter states
  const managerId = useSelector(selectCurrentUser);
  const [exportLimit, setExportLimit] = useState(100); // Default limit
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState(() => {
    if (columns.length > 0) {
      const columnKeys = columns.map((col) => col.accessor);
      return columnKeys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
    }
    return {};
  });

  // Prepare query parameters
  const queryParams = {
    managerId: managerId,
    startDate: filterStartDate || undefined,
    endDate: filterEndDate || undefined,
    collaborateurId: selectedCollaborateur != null ? collaborateurId : undefined,
    limit: exportLimit,
    offset: 0,
  };

  // Use the RTK Query hook
  const { data, isLoading, isFetching } = useFiltrePointagesQuery(queryParams, {
    skip: !open || !managerId, // Only fetch when dialog is open and managerId is provided
  });

  // Format the fetched data for export
  const formattedData = React.useMemo(() => {
    if (!data || !data.pointages) return [];

    return data.pointages.map((pointage) => {
      return {
        id: pointage.id,
        collaborateur: `${pointage.collaborateur.nom} ${pointage.collaborateur.prenom}`,
        date: formatDate(pointage.date),
        heure_arrivee: formatTime(pointage.heure_arrivee),
        heure_depart: formatTime(pointage.heure_depart),
        status: pointage.heure_depart ? "A quité" : "En poste",
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
        if (selectedColumns[key]) {
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
    if (data && data.pointages && data.pointages.length > 0) {
      setExportLimit((prev) => Math.min(prev, data.pointages.length));
    }
  }, [data]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{"Exporter l'historique de pointage"}</Typography>
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

          {/* Collaborateur filter */}
          <Grid item xs={12} md={6}>
            <AutocompleteField
              useFetchHook={() => useGetCollaborateursByManagerQuery(managerId)}
              fullWidth
              setSelectedItem={setSelectedCollaborateur}
              setIdItem={setCollaborateurId}
              selectedItem={selectedCollaborateur}
              label="Choisir un collaborateur"
            />
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
                  max: data?.pointages?.length || 100,
                },
              }}
              helperText={
                data?.pointages ? `Maximum: ${data.pointages.length} lignes` : "Chargement..."
              }
            />
          </Grid>

          {/* Date filters */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Date début"
              type="date"
              fullWidth
              size="small"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Date fin"
              type="date"
              fullWidth
              size="small"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

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
              {data?.pointages
                ? `${data.pointages.length} enregistrements trouvés`
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

export default PointageExportDialog;
