/* eslint-disable react/jsx-key */
import { Box, Card, CircularProgress, Grid, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import { useSelector } from "react-redux";
import { useGetPointagesQuery } from "store/api/pointageApi";
import { useState, useMemo, useEffect } from "react";
import { selectCurrentUser } from "store/slices/authSlice";
import { useGetCongesQuery } from "store/api/congeApi";
import EmployeeCard from "./employeeCard";
import { isSameDate } from "functions/dateTime";

function Pointage() {
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const managerId = useSelector(selectCurrentUser);
  const {
    data: pointages = [],
    isLoading,
    refetch: refetchPointages,
  } = useGetPointagesQuery(managerId);
  const { data: collaborateurs = [], refetch: refetchCollaborateurs } =
    useGetCollaborateursByManagerQuery(managerId);

  const { data: conges = [], refetch: refetchConges } = useGetCongesQuery(managerId);

  useEffect(() => {
    refetchCollaborateurs();
    refetchPointages();
    refetchConges();
  }, [selectedDate]);

  const today = new Date().toISOString().split("T")[0];

  const currentHour = new Date().getHours();

  const todayPointages = useMemo(
    () => pointages.filter((p) => isSameDate(p.date, today)),
    [pointages, today]
  );

  const selectedDatePointages = useMemo(
    () => pointages.filter((p) => isSameDate(p.date, selectedDate)),
    [pointages, selectedDate]
  );

  const getPointagesIds = (pointagesList) => new Set(pointagesList.map((p) => p.collaborateur.id));

  const nonPointes = (pointagesSet) =>
    collaborateurs.filter((collab) => !pointagesSet.has(collab.id));

  const nonPointesToday = useMemo(
    () => nonPointes(getPointagesIds(todayPointages)),
    [collaborateurs, todayPointages]
  );

  const nonPointesSelectedDate = useMemo(
    () => nonPointes(getPointagesIds(selectedDatePointages)),
    [collaborateurs, selectedDatePointages]
  );

  const isOnLeave = (collab) => {
    return conges.some((conge) => {
      if (conge.collaborateur.id !== collab.id) return false;
      const start = new Date(conge.date_debut).toISOString().split("T")[0];
      const end = new Date(conge.date_fin).toISOString().split("T")[0];
      return selectedDate >= start && selectedDate <= end;
    });
  };

  const filteredNonPointesToday = useMemo(
    () =>
      nonPointesToday.filter((collab) => {
        const matchesCollaborateur = collaborateurId === null || collab.id === collaborateurId;
        const isLeave = isOnLeave(collab);
        console.log("collab", collab);
        console.log("collab isleave", isLeave);
        // Détermine le statut calculé :
        let computedStatus = currentHour > 17 ? "Absent" : "Pas encore arrivé";
        if (isLeave) {
          computedStatus = "En congé";
        }
        const matchesStatus = filterStatus === "all" || filterStatus === computedStatus;
        return matchesCollaborateur && matchesStatus;
      }),
    [nonPointesToday, collaborateurId, filterStatus, currentHour, conges, selectedDate]
  );

  const filteredNonPointesSelectedDate = useMemo(
    () =>
      nonPointesSelectedDate.filter((collab) => {
        const matchesCollaborateur = collaborateurId === null || collab.id === collaborateurId;
        const isLeave = isOnLeave(collab);
        console.log("collab", collab);
        console.log("collab isleave", isLeave);
        // Pour une date passée, par défaut, on considère "Absent" sauf s'il était en congé
        const computedStatus = isLeave ? "En congé" : "Absent";
        const matchesStatus = filterStatus === "all" || filterStatus === computedStatus;
        return matchesCollaborateur && matchesStatus;
      }),
    [nonPointesSelectedDate, collaborateurId, filterStatus, conges, selectedDate]
  );

  const filteredPointages = useMemo(() => {
    return pointages.filter((pointage) => {
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "En poste" && pointage.status === "En poste") ||
        (filterStatus === "A quité" && pointage.status === "A quité") ||
        (filterStatus !== "all" && filterStatus !== "En poste" && pointage.status === "Absent");
      const matchesDate = isSameDate(pointage.date, selectedDate);
      const matchesCollaborateur =
        collaborateurId === null || pointage.collaborateur.id === collaborateurId;
      return matchesStatus && matchesDate && matchesCollaborateur;
    });
  }, [pointages, filterStatus, selectedDate, collaborateurId]);

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
                          <option value="Pas encore arrivé">Pas encore arrivé</option>
                          <option value="Absent">Absent</option>
                          <option value="En congé">En congé</option>
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
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        {filteredPointages.map((pointage, index) => (
                          <EmployeeCard key={index} pointage={pointage} />
                        ))}
                        {selectedDate === today &&
                          filteredNonPointesToday.map((collab, index) => (
                            <EmployeeCard
                              key={`np-${index}`}
                              pointage={{
                                collaborateur: collab,
                                status: isOnLeave(collab)
                                  ? "En congé"
                                  : currentHour > 17
                                  ? "Absent"
                                  : "Pas encore arrivé",
                              }}
                            />
                          ))}
                        {selectedDate < today &&
                          filteredNonPointesSelectedDate.map((collab, index) => (
                            <EmployeeCard
                              key={`np-${index}`}
                              pointage={{
                                collaborateur: collab,
                                status: isOnLeave(collab) ? "En congé" : "Absent",
                              }}
                            />
                          ))}
                      </Box>
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
