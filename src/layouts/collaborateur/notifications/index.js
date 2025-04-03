// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Pagination from "@mui/material/Pagination";
import { CircularProgress, Tooltip, Chip, Divider } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// API et Redux
import {
  useGetNotificationByCollaborateurQuery,
  useDeleteNotificationByCollaborateurMutation,
} from "store/api/notificationApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";

// React hooks
import { useState, useMemo } from "react";
import DashboardNavbar from "../DashboardNavbar";

function Notifications() {
  const collaborateurId = useSelector(selectCurrentUser);

  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useGetNotificationByCollaborateurQuery(collaborateurId);

  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationByCollaborateurMutation();

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      refetch();
    } catch (err) {
      console.error("Erreur lors de la suppression de la notification :", err);
    }
  };

  // Pagination logic with useMemo for performance
  const paginatedNotifications = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return notifications.slice(startIndex, endIndex);
  }, [notifications, page, itemsPerPage]);

  // Categorize notifications (example implementation)
  const getCategoryAndIcon = (notification) => {
    const categorizedNotifications = {
      Projet: { icon: "work", color: "primary" },
      Rappel: { icon: "alarm", color: "warning" },
      Message: { icon: "message", color: "info" },
      Système: { icon: "settings", color: "secondary" },
    };

    // Determine category based on notification content (you might want to adapt this)
    const category =
      Object.keys(categorizedNotifications).find((cat) =>
        notification.contenu.toLowerCase().includes(cat.toLowerCase())
      ) || "Système";

    return categorizedNotifications[category];
  };

  const renderLoadingState = () => (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "calc(100vh - 200px)" }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 600,
            p: 4,
            textAlign: "center",
            background: "linear-gradient(145deg, #f0f0f0 0%, #e6e6e6 100%)",
          }}
        >
          <CircularProgress color="primary" size={80} thickness={4} />
          <MDTypography
            variant="h5"
            color="text"
            mt={3}
            sx={{
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Chargement des notifications...
          </MDTypography>
        </Card>
      </MDBox>
    </DashboardLayout>
  );

  const renderNotifications = () => (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: 5,
                  background: "linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)",
                },
              }}
            >
              <MDBox p={3} pb={0} display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography
                  variant="h5"
                  color="text"
                  sx={{
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Notifications
                </MDTypography>
                {notifications.length > 0 && (
                  <Chip
                    label={`${notifications.length} notifications`}
                    color="primary"
                    size="small"
                  />
                )}
              </MDBox>

              <Divider variant="middle" sx={{ mb: 2 }} />

              {paginatedNotifications.length === 0 ? (
                <MDBox display="flex" flexDirection="column" alignItems="center" p={4}>
                  <Icon color="disabled" sx={{ fontSize: 80, mb: 2 }}>
                    notifications_off
                  </Icon>
                  <MDTypography variant="h6" color="text.secondary" align="center">
                    Aucune notification
                  </MDTypography>
                </MDBox>
              ) : (
                <MDBox px={3}>
                  {paginatedNotifications.map((notification) => {
                    const { icon, color } = getCategoryAndIcon(notification);
                    return (
                      <MDBox
                        key={notification.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          bgcolor: "background.default",
                          borderRadius: 2,
                          p: 2,
                          mb: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateX(10px)",
                            boxShadow: 2,
                          },
                        }}
                      >
                        <Icon color={color} sx={{ mr: 2 }}>
                          {icon}
                        </Icon>
                        <MDTypography
                          variant="body2"
                          color="text.primary"
                          sx={{
                            flex: 1,
                            mr: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {notification.contenu}
                        </MDTypography>
                        <Tooltip title="Supprimer">
                          <Icon
                            sx={{
                              cursor: "pointer",
                              color: "error.main",
                              opacity: isDeleting ? 0.5 : 1,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.2)",
                                color: "error.dark",
                              },
                            }}
                            onClick={() => handleDeleteNotification(notification.id)}
                            disabled={isDeleting}
                          >
                            delete
                          </Icon>
                        </Tooltip>
                      </MDBox>
                    );
                  })}
                </MDBox>
              )}

              <MDBox display="flex" justifyContent="center" p={2}>
                <Pagination
                  count={Math.ceil(notifications.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );

  if (isLoading) return renderLoadingState();
  if (isError) return renderLoadingState(); // Simplified error handling

  return renderNotifications();
}

export default Notifications;
