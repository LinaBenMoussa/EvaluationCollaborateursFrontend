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
import { useCongesTableData } from "./data/useCongesTableData";
import { TextField, MenuItem, CircularProgress } from "@mui/material";
import { convertDateFormat } from "functions/dateTime";
import { isDateInRange } from "functions/dateTime";

function CongesListCollaborateur() {
  const collaborateurId = useSelector(selectCurrentUser);
  const [filterType, setFilterType] = useState("Tous");
  const [selectedDateDebut1, setSelectedDateDebut1] = useState("");
  const [selectedDateDebut2, setSelectedDateDebut2] = useState("");
  const [selectedDateFin1, setSelectedDateFin1] = useState("");
  const [selectedDateFin2, setSelectedDateFin2] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const { columns, rows, isLoading } = useCongesTableData(collaborateurId);

  if (selectedDateDebut2 && selectedDateDebut2 < selectedDateDebut1) {
    setSelectedDateDebut1(selectedDateDebut2);
  }
  if (selectedDateFin2 && selectedDateFin2 < selectedDateFin1) {
    setSelectedDateFin1(selectedDateFin2);
  }

  const filteredRows = rows.filter((row) => {
    const typeMatch = filterType !== "Tous" ? row.type === filterType : true;
    return (
      typeMatch &&
      isDateInRange(convertDateFormat(row.date_debut), selectedDateDebut1, selectedDateDebut2) &&
      isDateInRange(convertDateFormat(row.date_fin), selectedDateFin1, selectedDateFin2)
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
                  Liste des congés
                </MDTypography>
                <IconButton color="white" onClick={() => setOpenFilter(true)}>
                  <FilterListIcon sx={{ color: "white" }} />
                </IconButton>
              </MDBox>

              <MDBox pt={1}>
                {isLoading ? (
                  <MDBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ minHeight: "300px" }}
                  >
                    <CircularProgress />
                  </MDBox>
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
            width: 400,
            padding: 2,
            height: "auto",
          },
        }}
      >
        <MDBox p={2}>
          <MDTypography variant="h6" mb={2}>
            Filtres
          </MDTypography>

          <MDBox display="flex" flexDirection="column" gap={2}>
            <TextField
              select
              label="Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              SelectProps={{
                sx: { height: 43, display: "flex", alignItems: "center" },
              }}
            >
              <MenuItem value="Tous">Tous</MenuItem>
              <MenuItem value="Congé annuel">Congé annuel</MenuItem>
              <MenuItem value="Autorisation">Autorisation</MenuItem>
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
          </MDBox>
        </MDBox>
      </Drawer>
    </DashboardLayout>
  );
}

export default CongesListCollaborateur;
