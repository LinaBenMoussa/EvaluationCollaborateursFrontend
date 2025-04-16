// Notifications.js
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";
import { formatDateWithTime } from "functions/dateTime";
import { GrPowerReset } from "react-icons/gr";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Pagination from "@mui/material/Pagination";
import {
  CircularProgress,
  Tooltip,
  Chip,
  Divider,
  Box,
  Paper,
  alpha,
  useTheme,
  TextField,
  InputAdornment,
  IconButton,
  Fade,
} from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import AutocompleteField from "layouts/shared/autocompleteField";

// API et Redux
import {
  useDeleteNotificationByCollaborateurMutation,
  useFiltreNotificationsQuery,
} from "store/api/notificationApi";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";

// Import des styles
import createNotificationStyles from "./styles";

function Notifications() {
  const theme = useTheme();
  const managerId = useSelector(selectCurrentUser);
  const styles = createNotificationStyles(theme);
  const { blueColors } = styles;

  // States
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState("");
  const [selectedDate2, setSelectedDate2] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Queries
  const {
    data = { notifications: [], total: 0 },
    isLoading: isLoadingData,
    isFetching,
    refetch,
  } = useFiltreNotificationsQuery({
    managerId,
    startDate: selectedDate1,
    endDate: selectedDate2,
    ...(collaborateurId !== null && { collaborateurId }),
    offset: (page - 1) * itemsPerPage,
    limit: itemsPerPage,
  });

  // Mutations
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationByCollaborateurMutation();

  // Effects
  useEffect(() => {
    setPage(1);
  }, [collaborateurId, selectedDate1, selectedDate2]);

  // Handlers
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

  const handleClearFilters = () => {
    setSelectedCollaborateur(null);
    setCollaborateurId(null);
    setSelectedDate1("");
    setSelectedDate2("");
  };

  // Composant de chargement pour la liste de notifications
  const renderLoadingNotifications = () => (
    <Box sx={styles.loadingContainer}>
      <CircularProgress
        size={40}
        sx={{
          color: blueColors.main,
        }}
      />
    </Box>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Card sx={styles.card}>
          {/* Filter section */}
          <Box sx={styles.filterSection}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}></Grid>
              <Grid item xs={12} md={4}>
                <AutocompleteField
                  useFetchHook={() => useGetCollaborateursByManagerQuery(managerId)}
                  fullWidth
                  setSelectedItem={setSelectedCollaborateur}
                  setIdItem={setCollaborateurId}
                  selectedItem={selectedCollaborateur}
                  label="Choisir un collaborateur"
                  sx={styles.autocompleteField}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="date"
                      label="Date de début"
                      InputLabelProps={{ shrink: true }}
                      value={selectedDate1}
                      onChange={(e) => setSelectedDate1(e.target.value)}
                      fullWidth
                      sx={styles.dateField}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon sx={{ color: blueColors.main }} fontSize="small">
                              calendar_today
                            </Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="date"
                      label="Date de fin"
                      InputLabelProps={{ shrink: true }}
                      value={selectedDate2}
                      onChange={(e) => setSelectedDate2(e.target.value)}
                      fullWidth
                      sx={styles.dateField}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon sx={{ color: blueColors.main }} fontSize="small">
                              calendar_today
                            </Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <MDButton
                  variant="outlined"
                  color="erreur"
                  onClick={handleClearFilters}
                  sx={styles.resetButton}
                >
                  <GrPowerReset color="#FF0000" />
                </MDButton>
              </Grid>
            </Grid>
          </Box>

          {/* Notifications section */}
          <Box sx={{ position: "relative", minHeight: "300px" }}>
            {/* Header */}
            <Box sx={styles.notificationsHeader}>
              <Box display="flex" alignItems="center">
                <Icon sx={styles.headerIcon}>notifications_none</Icon>
                <MDTypography variant="h5" fontWeight="medium" sx={{ color: "#FFFFFF" }}>
                  Notifications
                </MDTypography>
              </Box>

              {data.total > 0 && (
                <Chip
                  label={`${data.total} notification${data.total > 1 ? "s" : ""}`}
                  sx={styles.headerChip}
                  size="small"
                />
              )}
            </Box>

            {isLoadingData || isFetching ? (
              renderLoadingNotifications()
            ) : data.notifications.length === 0 ? (
              <Fade in={true} timeout={800}>
                <Box sx={styles.emptyNotifications}>
                  <Box sx={styles.emptyIconContainer}>
                    <Icon sx={{ fontSize: 50, color: blueColors.main }}>notifications_off</Icon>
                  </Box>
                  <MDTypography
                    variant="h5"
                    color="text.primary"
                    align="center"
                    fontWeight="medium"
                  >
                    Aucune notification
                  </MDTypography>
                  <MDTypography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                    mt={2}
                    sx={{ maxWidth: "400px", mx: "auto" }}
                  >
                    Vous serez informé lorsque de nouvelles notifications arriveront
                  </MDTypography>
                </Box>
              </Fade>
            ) : (
              <Box sx={styles.notificationsContainer}>
                {data.notifications.map((notification, index) => {
                  const { icon, color, bgColor } = styles.getCategoryAndIcon(notification);
                  return (
                    <Fade in={true} timeout={300 + index * 100} key={notification.id}>
                      <Paper
                        elevation={0}
                        sx={{
                          ...styles.notificationCard,
                          "&:hover": {
                            ...styles.notificationCard["&:hover"],
                            borderColor: alpha(color, 0.5),
                            backgroundColor: alpha(bgColor, 0.5),
                          },
                        }}
                      >
                        <Box sx={styles.iconContainer(bgColor)}>
                          <Icon sx={{ color, fontSize: 24 }}>{icon}</Icon>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <MDTypography variant="body2" sx={styles.collaborateurName}>
                            {notification.collaborateur.prenom} {notification.collaborateur.nom}
                          </MDTypography>
                          <MDTypography variant="body2" sx={styles.notificationContent}>
                            {notification.contenu}
                          </MDTypography>
                        </Box>

                        <Chip
                          label={formatDateWithTime(notification.dateEnvoi)}
                          size="small"
                          sx={styles.dateChip}
                          icon={
                            <Icon fontSize="small" sx={{ color: blueColors.main }}>
                              event
                            </Icon>
                          }
                        />

                        <Tooltip title="Supprimer" placement="left">
                          <IconButton
                            size="small"
                            sx={styles.deleteButton}
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <Icon fontSize="small">delete_outline</Icon>
                          </IconButton>
                        </Tooltip>
                      </Paper>
                    </Fade>
                  );
                })}
              </Box>
            )}

            {/* Loading overlay */}
            {(isLoadingData || isFetching) && data.notifications.length > 0 && (
              <Box sx={styles.loadingOverlay}>
                <CircularProgress size={40} sx={{ color: blueColors.main }} />
              </Box>
            )}
          </Box>

          {/* Pagination footer */}
          {data.total > itemsPerPage && (
            <>
              <Divider sx={{ borderColor: alpha(blueColors.main, 0.1) }} />
              <Box sx={styles.paginationContainer}>
                <Pagination
                  count={Math.ceil(data.total / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                  sx={styles.pagination}
                />
              </Box>
            </>
          )}
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Notifications;
