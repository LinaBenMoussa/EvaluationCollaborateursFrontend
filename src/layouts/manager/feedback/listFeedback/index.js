/* eslint-disable react/jsx-key */
import { Box, Card, CircularProgress, Grid, Stack, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import FeedbackCard from "./feedbackCard";
import FeedbackList from "./feedbackList";
import { useSelector } from "react-redux";
import { useGetFeedbackQuery } from "store/api/feedbackApi";
import { selectCurrentUser } from "store/slices/authSlice";

function ListFeedback() {
  const collaborateurId = useSelector(selectCurrentUser);
  const { data: feedbacksdata = [], isLoading } = useGetFeedbackQuery(collaborateurId);
  const feedbacks = feedbacksdata.map((feedback) => {
    const date = new Date(feedback.dateFeedback);
    const formattedDate = date.toLocaleDateString("fr-FR"); // Format DD/MM/YYYY
    const formattedTime = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); // Format HH:MM

    return (
      <FeedbackCard
        key={feedback.id}
        dateTime={`${formattedDate} ${formattedTime} `}
        manager={`${feedback.manager.nom} ${feedback.manager.prenom}`}
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
              <MDBox pt={3}>
                <MDBox pt={4} pb={3} px={3}>
                  <Box display="flex" justifyContent="center" alignItems="center">
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

export default ListFeedback;
