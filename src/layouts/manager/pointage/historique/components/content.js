/* eslint-disable react/prop-types */
import { alpha } from "@mui/material";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  Paper,
  Box,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import TablePagination from "@mui/material/TablePagination";
import CloseIcon from "@mui/icons-material/Close";
import MDButton from "components/MDButton";

export const HistoriqueContent = ({
  theme,
  isMobile,
  filterType,
  setFilterType,
  activeFilters,
  handleResetFilters,
  collaborateurId,
  selectedCollaborateur,
  selectedDate1,
  selectedDate2,
  setCollaborateurId,
  setSelectedCollaborateur,
  setSelectedDate1,
  setSelectedDate2,
  setFilters,
  isLoading,
  columns,
  rows,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <MDBox p={3}>
      {/* Filtres rapides */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: "10px",
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <MDBox
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          alignItems={isMobile ? "stretch" : "center"}
          justifyContent="space-between"
        >
          <FormControl sx={{ minWidth: 220, mb: isMobile ? 2 : 0 }}>
            <InputLabel id="filter-type-label">Période</InputLabel>
            <Select
              labelId="filter-type-label"
              label="Période"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{
                height: 45,
                "&.MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            >
              <MenuItem value="today">{"Aujourd'hui"}</MenuItem>
              <MenuItem value="yesterday">Hier</MenuItem>
              <MenuItem value="thisWeek">Cette semaine</MenuItem>
              <MenuItem value="thisMonth">Ce mois</MenuItem>
              <MenuItem value="thisYear">Cette année</MenuItem>
              <MenuItem value="custom">Personnalisée</MenuItem>
            </Select>
          </FormControl>

          {activeFilters > 0 && (
            <MDButton
              variant="outlined"
              color="error"
              size="small"
              onClick={handleResetFilters}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                py: 1,
              }}
              startIcon={<CloseIcon />}
            >
              Réinitialiser les filtres
            </MDButton>
          )}
        </MDBox>
      </Paper>

      {/* Filtres actifs */}
      {activeFilters > 0 && (
        <MDBox display="flex" flexWrap="wrap" gap={1} mb={3}>
          {collaborateurId !== null && (
            <Chip
              label={`Collaborateur: ${selectedCollaborateur?.nom} ${selectedCollaborateur?.prenom}`}
              onDelete={() => {
                setCollaborateurId(null);
                setSelectedCollaborateur(null);
                setFilters((prev) => ({ ...prev, collaborateurId: null }));
              }}
              size="small"
              color="primary"
              sx={{
                borderRadius: "6px",
                fontWeight: "medium",
                "& .MuiChip-label": { px: 2 },
                "& .MuiChip-deleteIcon": { color: "white" },
              }}
            />
          )}
          {(selectedDate1 || selectedDate2) && (
            <Chip
              label={`Période: ${selectedDate1 || ""} - ${selectedDate2 || ""}`}
              onDelete={() => {
                setSelectedDate1("");
                setSelectedDate2("");
                setFilters((prev) => ({ ...prev, startDate: "", endDate: "" }));
              }}
              size="small"
              color="primary"
              sx={{
                borderRadius: "6px",
                fontWeight: "medium",
                "& .MuiChip-label": { px: 2 },
                "& .MuiChip-deleteIcon": { color: "white" },
              }}
            />
          )}
        </MDBox>
      )}

      {/* Tableau de données avec chargement */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: "300px" }}>
          <CircularProgress color="info" />
        </Box>
      ) : (
        <>
          <DataTable
            table={{ columns, rows }}
            isSorted={true}
            entriesPerPage={true}
            showTotalEntries={true}
            canSearch={true}
            noEndBorder={true}
            sx={{
              "& .MuiTableRow-root:hover": {
                backgroundColor: alpha(theme.palette.info.main, 0.05),
              },
              "& .MuiTableCell-head": {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                fontWeight: "bold",
              },
            }}
          />

          {/* Contrôles de pagination */}
          <MDBox display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={onPageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={onRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Lignes par page:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
              }
              sx={{
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                  margin: 0,
                },
              }}
            />
          </MDBox>

          {/* Info de pagination */}
          <MDBox
            mt={2}
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            justifyContent="space-between"
            alignItems={isMobile ? "flex-start" : "center"}
            p={2}
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: "10px",
            }}
          >
            <MDTypography variant="body2" color="text">
              Affichage de <strong>{rows.length}</strong> pointages
              {total > 0 && ` sur un total de <strong>${total}</strong>`}
            </MDTypography>
          </MDBox>
        </>
      )}
    </MDBox>
  );
};
