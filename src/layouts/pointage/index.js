/* eslint-disable react/jsx-key */
import { Box, Card, CircularProgress, Grid, Stack, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import EmployeeList from "./employeeCard";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import { useSelector } from "react-redux";
import EmployeeCard from "./employeeCard";
import { useGetPointagesQuery } from "store/api/pointageApi";
import { useState } from "react";
import { selectCurrentUser } from "store/slices/authSlice";

function Pointage() {
  const [collaborateurId, setCollaborateurId] = useState(null);
  console.log("collaborateurId", collaborateurId);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const managerId = useSelector(selectCurrentUser);
  const { data: pointages = [], isLoading } = useGetPointagesQuery(managerId);
  const filteredPointages = pointages
    .filter((pointage) => {
      if (filterStatus === "all") return true;
      return filterStatus === "En poste"
        ? pointage.status === "En poste"
        : pointage.status === "absent";
    })
    .filter((pointage) => {
      if (!selectedDate) return true;
      return (
        new Date(pointage.date).toLocaleDateString("fr-FR") ===
        new Date(selectedDate).toLocaleDateString("fr-FR")
      );
    })
    .filter((pointage) => {
      if (collaborateurId === null) return true;
      return pointage.collaborateur.id === collaborateurId;
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
              >
                <MDTypography variant="h6" color="white">
                  Pointage
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox pt={4} pb={3} px={3}>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDBox display="flex" alignItems="center">
                      <MDBox m={2} sx={{ width: 260 }}>
                        <AutocompleteField
                          useFetchHook={() => useGetCollaborateursByManagerQuery(managerId)}
                          fullWidth
                          setSelectedItem={setSelectedCollaborateur}
                          setIdItem={setCollaborateurId}
                          selectedItem={selectedCollaborateur}
                          label="Choisir un collaborateur"
                        />
                      </MDBox>
                      <MDBox mr={2}>
                        <TextField
                          select
                          label="Status"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          SelectProps={{ native: true }}
                          sx={{ width: 200 }}
                        >
                          <option value="all">Tous</option>
                          <option value="En poste">En poste</option>
                          <option value="A quité">A quité</option>
                        </TextField>
                      </MDBox>

                      <MDBox>
                        <TextField
                          type="date"
                          label="Date"
                          InputLabelProps={{ shrink: true }}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          fullWidth
                        />
                      </MDBox>
                    </MDBox>
                  </MDBox>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    {isLoading ? (
                      <CircularProgress />
                    ) : (
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {filteredPointages.map((pointage, index) => (
                          <EmployeeCard key={index} pointage={pointage} />
                        ))}
                      </div>
                    )}
                  </Box>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Pointage;
