/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from "react";
import { Box, Card, CircularProgress, Grid, IconButton, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";

import { useSelector } from "react-redux";
import FeedbackCard from "../listFeedback/feedbackCard";
import FeedbackList from "../listFeedback/feedbackList";
import { useNavigate } from "react-router-dom";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import { formatDateWithTime } from "functions/dateTime";
import { isDateInRange } from "functions/dateTime";
import { selectCurrentUser } from "store/slices/authSlice";
import { useGetFeedbackByManagerQuery } from "store/api/feedbackApi";
import { exportToExcel } from "functions/exportToExcel";
import exceller from "assets/images/icons/flags/exceller.png";

function FeedbackListManager() {
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [selectedDate1, setSelectedDate1] = useState("");
  const [selectedDate2, setSelectedDate2] = useState("");
  const [selectedButtonToday, setSelectedButtonToday] = useState(null);
  const [selectedButtonYesterday, setSelectedButtonYesterday] = useState(null);

  const navigate = useNavigate();
  const managerId = useSelector(selectCurrentUser);

  var { data: feedbacksdata = [], isLoading, refetch } = useGetFeedbackByManagerQuery(managerId);
  useEffect(() => {
    refetch();
  }, []);

  const filteredFeedbacks = feedbacksdata
    .filter((feedback) => {
      if (filterType === "all") return true;
      return filterType === "positif" ? feedback.type === "positif" : feedback.type === "negatif";
    })
    .filter((feedback) => {
      if (!selectedDate1 && !selectedDate2) return true;
      return isDateInRange(feedback.date_feedback.split("T")[0], selectedDate1, selectedDate2);
    })
    .filter((feedback) => {
      if (collaborateurId === null) return true;
      return feedback.collaborateur.id === collaborateurId;
    });

  if (selectedDate2 && selectedDate2 < selectedDate1) {
    setSelectedDate1(selectedDate2);
  }

  const exportData = filteredFeedbacks.map((feedback) => ({
    id: feedback.id,
    date_feedback: formatDateWithTime(feedback.date_feedback),
    manager: `${feedback.manager.nom} ${feedback.manager.prenom}`,
    collaborateur: `${feedback.collaborateur.nom} ${feedback.collaborateur.prenom}`,
    commentaire: feedback.commentaire,
    type: feedback.type,
  }));

  const feedbacks = filteredFeedbacks.map((feedback) => {
    return (
      <FeedbackCard
        key={feedback.id}
        dateTime={formatDateWithTime(feedback.date_feedback)}
        manager={`à: ${feedback.manager.nom} ${feedback.manager.prenom}`}
        comment={feedback.commentaire}
        isNegative={feedback.type === "negatif"}
      />
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
                  {`Liste d'évaluations`}
                </MDTypography>
                <MDBox>
                  <IconButton
                    color="white"
                    onClick={() => exportToExcel(exportData, "Liste_des_Evaluations")}
                  >
                    <img src={exceller} alt="Exporter en Excel" style={{ width: 30, height: 30 }} />
                  </IconButton>
                </MDBox>
              </MDBox>
              <MDBox pt={1}>
                <MDBox justifyContent="space-between">
                  <MDBox m={1} display="flex" justifyContent="space-between" alignItems="center">
                    <MDBox>
                      <MDButton
                        style={{ color: selectedButtonToday === "today" ? "blue" : "grey" }}
                        onClick={() => {
                          setSelectedButtonToday("today");
                          setSelectedButtonYesterday(null);
                          setSelectedDate1(new Date().toISOString().split("T")[0]);
                          setSelectedDate2(new Date().toISOString().split("T")[0]);
                        }}
                      >{`Aujourd'hui`}</MDButton>
                      <MDButton
                        style={{
                          color: selectedButtonYesterday === "Yesterday" ? "blue" : "grey",
                        }}
                        onClick={() => {
                          setSelectedButtonYesterday("Yesterday");
                          setSelectedButtonToday(null);
                          const yesterday = new Date();
                          yesterday.setDate(yesterday.getDate() - 1); // Recule d'un jour
                          const formattedDate = yesterday.toISOString().split("T")[0]; // Format YYYY-MM-DD
                          setSelectedDate1(formattedDate);
                          setSelectedDate2(formattedDate);
                        }}
                      >{`Hier`}</MDButton>
                    </MDBox>
                    <MDBox mr={5} mh={2}>
                      <MDButton
                        variant="contained"
                        color="info"
                        onClick={() => navigate("/addfeedback")}
                      >
                        Ajouter
                      </MDButton>
                    </MDBox>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDBox display="flex" alignItems="center">
                      <MDBox mr={2} ml={2} sx={{ width: 280 }}>
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
                          label="Type"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          SelectProps={{ native: true }}
                          sx={{ width: 200 }}
                        >
                          <option value="all">Tous</option>
                          <option value="positif">Positifs</option>
                          <option value="negatif">Négatifs</option>
                        </TextField>
                      </MDBox>

                      <MDBox>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              type="date"
                              label="De"
                              InputLabelProps={{ shrink: true }}
                              value={selectedDate1}
                              onChange={(e) => {
                                setSelectedButtonToday(null);
                                setSelectedButtonYesterday(null);
                                setSelectedDate1(e.target.value);
                              }}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              type="date"
                              label="À"
                              InputLabelProps={{ shrink: true }}
                              value={selectedDate2}
                              onChange={(e) => {
                                setSelectedButtonToday(null);
                                setSelectedButtonYesterday(null);
                                setSelectedDate2(e.target.value);
                              }}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </MDBox>
                    </MDBox>
                  </MDBox>

                  <Box display="flex" justifyContent="center" alignItems="center">
                    {isLoading ? (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ minHeight: "300px" }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : (
                      <FeedbackList feedbacks={feedbacks} />
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

export default FeedbackListManager;
