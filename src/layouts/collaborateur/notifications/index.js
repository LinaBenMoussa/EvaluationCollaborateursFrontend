// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Pagination from "@mui/material/Pagination";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// API et Redux
import { useGetNotificationByCollaborateurQuery } from "store/api/notificationApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";

// React hooks
import { useState } from "react";

function Notifications() {
  // Récupérer l'ID du collaborateur connecté
  const collaborateurId = useSelector(selectCurrentUser);

  // Utiliser le hook RTK Query pour récupérer les notifications
  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useGetNotificationByCollaborateurQuery(collaborateurId);

  // États pour la pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Nombre de notifications par page

  // Fonction pour gérer le changement de page
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Fonction pour supprimer une notification (à implémenter côté backend)
  const handleDeleteNotification = (notificationId) => {
    console.log("Supprimer la notification avec l'ID :", notificationId);
    // Ajoutez ici la logique pour supprimer la notification
  };

  // Calcul des notifications à afficher pour la page actuelle
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotifications = notifications.slice(startIndex, endIndex);

  // Afficher un message de chargement si les données sont en cours de chargement
  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox mt={6} mb={3}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={8}>
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h5">Chargement en cours...</MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    );
  }

  // Afficher un message d'erreur si la requête a échoué
  if (isError) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox mt={6} mb={3}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={8}>
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h5" color="error">
                    {"Une erreur s'est produite lors du chargement des notifications."}
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    );
  }

  // Afficher les notifications
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Notifications</MDTypography>
              </MDBox>
              <MDBox pt={2} px={2}>
                {paginatedNotifications.map((notification) => (
                  <MDBox
                    key={notification.id}
                    bgColor="info"
                    borderRadius="md"
                    p={2}
                    mb={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <MDTypography variant="body2" color="white">
                      {notification.contenu}
                    </MDTypography>
                    <Icon
                      style={{ cursor: "pointer", color: "white" }}
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      close
                    </Icon>
                  </MDBox>
                ))}
              </MDBox>
              {/* Pagination */}
              <MDBox display="flex" justifyContent="center" p={2}>
                <Pagination
                  count={Math.ceil(notifications.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Notifications;
