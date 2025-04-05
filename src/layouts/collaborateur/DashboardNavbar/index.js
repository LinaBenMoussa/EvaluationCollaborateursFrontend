import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// MUI components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import Badge from "@mui/material/Badge";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Icons
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Context & Redux
import { useMaterialUIController, setMiniSidenav } from "context";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/slices/authSlice";

// API Notifications
import {
  useGetNotificationByCollaborateurQuery,
  useMarkNotificationsAsReadMutation,
} from "store/api/notificationApi";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  // Supposons que selectCurrentUser renvoie l'ID du collaborateur connecté
  const collaborateurId = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  // Récupération des notifications
  const { data: notifications = [], refetch } =
    useGetNotificationByCollaborateurQuery(collaborateurId);

  // Hook pour marquer les notifications comme lues
  const [markNotificationsAsRead] = useMarkNotificationsAsReadMutation();

  // Calcul du nombre de notifications non lues
  const unreadNotifications = notifications.filter((notif) => notif.lu == 0);
  const unreadCount = unreadNotifications.length;

  useEffect(() => {
    setNavbarType(fixedNavbar ? "sticky" : "static");
  }, [fixedNavbar]);

  // Lorsqu'on ouvre le menu, on marque les notifications non lues comme lues
  const handleOpenMenu = async (event) => {
    setOpenMenu(event.currentTarget);
    if (unreadCount > 0) {
      const unreadIds = unreadNotifications.map((notif) => notif.id);
      await markNotificationsAsRead(unreadIds);
      refetch();
    }
  };
  const handleNavigateToNotifications = () => {
    navigate("/notification");
  };

  const handleCloseMenu = () => setOpenMenu(false);
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  // Pour le rendu du menu, on affiche au maximum 3 notifications.
  // S'il y en a plus, le 4ᵉ item indique le nombre de notifications restantes.
  const renderMenu = () => {
    let itemsToDisplay = notifications;
    let extraCount = 0;
    if (notifications.length > 4) {
      itemsToDisplay = notifications.slice(0, 3);
      extraCount = notifications.length - 3;
    }
    return (
      <Menu
        anchorEl={openMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={Boolean(openMenu)}
        onClose={handleCloseMenu}
        sx={{ mt: 2 }}
      >
        {itemsToDisplay.map((notif) => (
          <NotificationItem
            key={notif.id}
            icon={<Icon>{notif.icon || "notifications"}</Icon>}
            title={notif.contenu}
          />
        ))}
        {extraCount > 0 && (
          <NotificationItem
            onClick={handleNavigateToNotifications}
            icon={<Icon>more_horiz</Icon>}
            title={`+ ${extraCount} notifications`}
          />
        )}
      </Menu>
    );
  };

  // Styles pour les icônes de la navbar
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }
      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          {/* Par exemple, ici on pourrait afficher un Breadcrumb */}
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <Link to="/authentication/sign-in/basic">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>account_circle</Icon>
                </IconButton>
              </Link>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Icon sx={iconsStyle}>notifications</Icon>
                </Badge>
              </IconButton>
              {renderMenu()}
              <Link to="/parametre">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <SettingsIcon sx={iconsStyle} />
                </IconButton>
              </Link>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
