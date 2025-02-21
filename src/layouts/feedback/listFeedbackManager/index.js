/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from "react";
import { Box, Button, Card, CircularProgress, Grid, Stack, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from "components/MDButton";
import SimpleBlogCard from "../../../examples/Cards/BlogCards/SimpleBlogCard";

import {
  useGetFeedbackByManagerAndCollaborateurQuery,
  useGetFeedbackByManagerQuery,
} from "../../../store/api/feedbackApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/slices/authSlice";
import FeedbackCard from "../listFeedback/feedbackCard";
import FeedbackList from "../listFeedback/feedbackList";
import { useNavigate } from "react-router-dom";
import AutocompleteField from "layouts/shared/autocompleteField";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";

function FeedbackListManager() {
  const [collaborateurId, setCollaborateurId] = useState(-1);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterType, setFilterType] = useState("all"); // all, positive, negative
  const [selectedDate, setSelectedDate] = useState(null);

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
      if (!selectedDate) return true;
      return (
        new Date(feedback.date_feedback).toLocaleDateString("fr-FR") ===
        new Date(selectedDate).toLocaleDateString("fr-FR")
      );
    })
    .filter((feedback) => {
      if (collaborateurId === -1) return true;
      return feedback.collaborateur.id === collaborateurId;
    });

  const feedbacks = filteredFeedbacks.map((feedback) => {
    const date = new Date(feedback.date_feedback);
    const formattedDate = date.toLocaleDateString("fr-FR");
    const formattedTime = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); // Format HH:MM
    return (
      <FeedbackCard
        key={feedback.id}
        dateTime={`${formattedDate} ${formattedTime} `}
        manager={`to: ${feedback.manager.nom} ${feedback.manager.prenom}`}
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
              >
                <MDTypography variant="h6" color="white">
                  Feedback
                </MDTypography>
              </MDBox>
              <MDBox pt={1}>
                <MDBox justifyContent="space-between">
                  <MDBox display="flex" justifyContent="space-between" alignItems="center">
                    <MDBox display="flex" alignItems="center">
                      <MDBox m={2} sx={{ width: 280 }}>
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
                          label="Type de feedback"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          SelectProps={{ native: true }}
                          sx={{ width: 200 }}
                        >
                          <option value="all">Tous</option>
                          <option value="positive">Positifs</option>
                          <option value="negative">Négatifs</option>
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
                    <MDBox m={5}>
                      <MDButton
                        variant="contained"
                        color="info"
                        onClick={() => navigate("/addfeedback")}
                      >
                        Add Feedback
                      </MDButton>
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
