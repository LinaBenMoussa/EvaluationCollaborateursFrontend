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
import { useFiltreSaisiesTempsQuery } from "store/api/saisieTemps";
import { formatDate } from "functions/dateTime";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import MDButton from "components/MDButton";

const SaisieExportToExcelDialog = ({ open, onClose, fileName, columns }) => {
  // Filter states
  const managerId = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState(0);
  const [exportLimit, setExportLimit] = useState(100); // Default limit

  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  // Date filters
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Collaborateur filter
  const [filterCollaborateur, setFilterCollaborateur] = useState("");

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
    startDate: filterStartDate || undefined,
    endDate: filterEndDate || undefined,
    collaborateurId: collaborateurId || undefined,
    limit: exportLimit,
    offset: 0,
  };

  // Use the RTK Query hook
  const { data, isLoading, isFetching } = useFiltreSaisiesTempsQuery(queryParams, {
    skip: !open || !managerId, // Only fetch when dialog is open and managerId is provided
  });

  // Format the fetched data similar to rows in useSaisiesTableData
  const formattedData = React.useMemo(() => {
    if (!data || !data.saisies) return [];

    return data.saisies.map((saisie) => {
      return {
        id: saisie.id,
        date: formatDate(saisie.date),
        heures: saisie.heures,
        commentaire: saisie.commentaire,
        collaborateur: `${saisie.collaborateur.nom} ${saisie.collaborateur.prenom}`,
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
    if (data && data.saisies && data.saisies.length > 0) {
      setExportLimit((prev) => Math.min(prev, data.saisies.length));
    }
  }, [data]);

  // Render date filter inputs
  const renderDateFilters = () => {
    return (
      <>
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
      </>
    );
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
            <Divider sx={{ mb: 2 }} />
          </Grid>

          {/* Collaborateur filter - optional based on your needs */}
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
                  max: data?.saisies?.length || 100,
                },
              }}
              helperText={
                data?.saisies ? `Maximum: ${data.saisies.length} lignes` : "Chargement..."
              }
            />
          </Grid>
          {/* Date range fields */}
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
              {data?.saisies
                ? `${data.saisies.length} enregistrements trouvés`
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

export default SaisieExportToExcelDialog;
