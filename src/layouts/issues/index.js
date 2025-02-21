import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import { useIssuesTableData } from "./data/useIssuesTableData";
import { TextField, MenuItem, CircularProgress } from "@mui/material";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import AutocompleteField from "layouts/shared/autocompleteField";

function Tables() {
  const managerId = useSelector(selectCurrentUser);
  const [collaborateurId, setCollaborateurId] = useState(-1);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedDateDebut1, setSelectedDateDebut1] = useState("");
  const [selectedDateDebut2, setSelectedDateDebut2] = useState("");
  const [selectedDateFin1, setSelectedDateFin1] = useState("");
  const [selectedDateFin2, setSelectedDateFin2] = useState("");
  const [selectedDateEcheance1, setSelectedDateEcheance1] = useState("");
  const [selectedDateEcheance2, setSelectedDateEcheance2] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const { columns, rows, isLoading } = useIssuesTableData(managerId);

  function convertDateFormat(input) {
    if (!input) return "";
    const [datePart] = input.split(" ");
    const parts = datePart.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }

  function isDateInRange(date, start, end) {
    return start && end
      ? date >= start && date <= end
      : start
      ? date >= start
      : end
      ? date <= end
      : true;
  }
  const filteredRows = rows.filter((row) => {
    const statusMatch = filterStatus ? row.status.props.children[1] === filterStatus : true;
    const collaborateurMatch =
      collaborateurId !== -1
        ? row.collaborateur === `${selectedCollaborateur?.nom} ${selectedCollaborateur?.prenom}`
        : true;

    return (
      statusMatch &&
      collaborateurMatch &&
      isDateInRange(convertDateFormat(row.date_debut), selectedDateDebut1, selectedDateDebut2) &&
      isDateInRange(convertDateFormat(row.date_fin), selectedDateFin1, selectedDateFin2) &&
      isDateInRange(
        convertDateFormat(row.date_echeance),
        selectedDateEcheance1,
        selectedDateEcheance2
      )
    );
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Issues Table
                </MDTypography>
                <IconButton color="white" onClick={() => setOpenFilter(true)}>
                  <FilterListIcon sx={{ color: "white" }} />
                </IconButton>
              </MDBox>

              <MDBox pt={1}>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <DataTable
                    table={{ columns, rows: filteredRows }}
                    isSorted={true}
                    entriesPerPage={true}
                    showTotalEntries={false}
                    canSearch={true}
                    noEndBorder={true}
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 400, // Largeur du box
            padding: 2,
            height: "auto", // Hauteur ajustée à la carte
          },
        }}
      >
        <MDBox p={2}>
          <MDTypography variant="h6" mb={2}>
            Filtres
          </MDTypography>

          <MDBox display="flex" flexDirection="column" gap={2}>
            <AutocompleteField
              useFetchHook={() => useGetCollaborateursByManagerQuery(managerId)}
              fullWidth
              setSelectedItem={setSelectedCollaborateur}
              setIdItem={setCollaborateurId}
              selectedItem={selectedCollaborateur}
              label="Choisir un collaborateur"
            />
            <TextField
              select
              label="Statut"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              SelectProps={{
                sx: { height: 43, display: "flex", alignItems: "center" },
              }}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="Terminé">Terminé</MenuItem>
              <MenuItem value="En cours">En cours</MenuItem>
              <MenuItem value="Bloqué">Bloqué</MenuItem>
              <MenuItem value="À faire">À faire</MenuItem>
            </TextField>
            <MDBox>
              <MDTypography variant="caption" sx={{ fontSize: "1rem" }} fontWeight="light" mb={1}>
                Date de début
              </MDTypography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="De"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDateDebut1}
                    onChange={(e) => setSelectedDateDebut1(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="À"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDateDebut2}
                    onChange={(e) => setSelectedDateDebut2(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </MDBox>
            <MDBox>
              <MDTypography variant="caption" sx={{ fontSize: "1rem" }} fontWeight="light" mb={1}>
                Date de fin
              </MDTypography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="De"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDateFin1}
                    onChange={(e) => setSelectedDateFin1(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="À"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDateFin2}
                    onChange={(e) => setSelectedDateFin2(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </MDBox>
            <MDBox>
              <MDTypography variant="caption" sx={{ fontSize: "1rem" }} fontWeight="light" mb={1}>
                Date Echeance
              </MDTypography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="De"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDateEcheance1}
                    onChange={(e) => setSelectedDateEcheance1(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="date"
                    label="À"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDateEcheance2}
                    onChange={(e) => setSelectedDateEcheance2(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
        </MDBox>
      </Drawer>
    </DashboardLayout>
  );
}

export default Tables;
