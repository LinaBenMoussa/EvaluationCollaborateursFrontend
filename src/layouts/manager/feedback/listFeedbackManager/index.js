import React, { useState } from "react";
import {
  Box,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Pagination,
  useTheme,
} from "@mui/material";
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
import { selectCurrentUser } from "store/slices/authSlice";
import { useFiltreFeedbacksQuery } from "store/api/feedbackApi";
import { Header } from "layouts/shared/Header";

function FeedbackListManager() {
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [selectedDate1, setSelectedDate1] = useState("");
  const [selectedDate2, setSelectedDate2] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();

  const navigate = useNavigate();
  const managerId = useSelector(selectCurrentUser);

  const {
    data: feedbackResponse = {
      feedbacks: [],
      total: 0,
    },
    isLoading,
  } = useFiltreFeedbacksQuery({
    managerId,
    startDate: selectedDate1,
    endDate: selectedDate2,
    ...(collaborateurId !== null && { collaborateurId }),
    ...(filterType !== "all" && { type: filterType }),
    offset: (page - 1) * rowsPerPage,
    limit: rowsPerPage,
  });

  const exportData = feedbackResponse.feedbacks.map((feedback) => ({
    id: feedback.id,
    date: formatDateWithTime(feedback.date_feedback),
    manager: `${feedback.manager.nom} ${feedback.manager.prenom}`,
    collaborateur: `${feedback.collaborateur.nom} ${feedback.collaborateur.prenom}`,
    commentaire: feedback.commentaire,
    type: feedback.type,
  }));

  const feedbackCards = feedbackResponse.feedbacks.map((feedback) => (
    <FeedbackCard
      key={feedback.id}
      dateTime={formatDateWithTime(feedback.date_feedback)}
      collaborateur={`à: ${feedback.collaborateur.nom} ${feedback.collaborateur.prenom}`}
      comment={feedback.commentaire}
      isNegative={feedback.type === "negatif"}
    />
  ));

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const resetDateFilter = () => {
    setSelectedDate1("");
    setSelectedDate2("");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: "15px",
                boxShadow: "0 8px 24px 0 rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <Header
                rows={exportData}
                theme={theme}
                fileName="Évaluations"
                title={"Liste d'évaluations"}
              />

              <MDBox p={3}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <AutocompleteField
                      useFetchHook={() => useGetCollaborateursByManagerQuery(managerId)}
                      fullWidth
                      setSelectedItem={setSelectedCollaborateur}
                      setIdItem={setCollaborateurId}
                      selectedItem={selectedCollaborateur}
                      label="Choisir un collaborateur"
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <TextField
                      select
                      label="Type"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      SelectProps={{ native: true }}
                      fullWidth
                    >
                      <option value="all">Tous</option>
                      <option value="positif">Positifs</option>
                      <option value="negatif">Négatifs</option>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <TextField
                          type="date"
                          label="De"
                          InputLabelProps={{ shrink: true }}
                          value={selectedDate1}
                          onChange={(e) => setSelectedDate1(e.target.value)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          type="date"
                          label="À"
                          InputLabelProps={{ shrink: true }}
                          value={selectedDate2}
                          onChange={(e) => setSelectedDate2(e.target.value)}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <MDButton
                      variant="outlined"
                      color="secondary"
                      onClick={resetDateFilter}
                      fullWidth
                    >
                      Réinitialiser
                    </MDButton>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <MDButton
                      variant="contained"
                      color="info"
                      onClick={() => navigate("/addfeedback")}
                      fullWidth
                    >
                      Ajouter
                    </MDButton>
                  </Grid>
                </Grid>

                <Box mt={3}>
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
                    <>
                      <FeedbackList feedbacks={feedbackCards} />
                      <Box display="flex" justifyContent="center" mt={3}>
                        <Pagination
                          count={Math.ceil(feedbackResponse.total / rowsPerPage)}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                        />
                      </Box>
                    </>
                  )}
                </Box>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default FeedbackListManager;
