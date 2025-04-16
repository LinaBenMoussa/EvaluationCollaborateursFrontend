// styles.js
import { alpha } from "@mui/material";

const createNotificationStyles = (theme) => {
  // Palette de couleurs bleues personnalisée
  const blueColors = {
    main: "#1976D2",
    light: "#42A5F5",
    dark: "#0D47A1",
    lightest: "#E3F2FD",
    accent: "#2196F3",
    gradient: "linear-gradient(90deg, #1565C0 0%, #42A5F5 100%)",
  };

  return {
    blueColors,

    card: {
      boxShadow: "0 4px 20px 0 rgba(0, 118, 255, 0.1)",
      borderRadius: "16px",
      overflow: "hidden",
      border: `1px solid ${alpha(blueColors.main, 0.1)}`,
    },

    filterSection: {
      background: "#ffffff",
      p: 3,
      borderBottom: `1px solid ${alpha(blueColors.main, 0.15)}`,
    },

    autocompleteField: {
      "& .MuiOutlinedInput-root": {
        backgroundColor: "#fff",
        borderRadius: "8px",
        borderColor: alpha(blueColors.main, 0.3),
        "&:hover": {
          borderColor: blueColors.main,
        },
        "&.Mui-focused": {
          borderColor: blueColors.main,
          boxShadow: `0 0 0 2px ${alpha(blueColors.main, 0.2)}`,
        },
      },
    },

    dateField: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: blueColors.main,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: blueColors.main,
          boxShadow: `0 0 0 2px ${alpha(blueColors.main, 0.2)}`,
        },
      },
    },

    resetButton: {
      borderRadius: "8px",
      height: "100%",
      borderColor: "erreur",
      color: blueColors.main,
      "&:hover": {
        backgroundColor: alpha(blueColors.main, 0.1),
        borderColor: blueColors.dark,
      },
    },

    notificationsHeader: {
      background: blueColors.gradient,
      py: 2.5,
      px: 3,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    headerIcon: {
      color: "#FFFFFF",
      fontSize: 28,
      mr: 1.5,
    },

    headerChip: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      color: "#FFFFFF",
      fontWeight: 500,
      backdropFilter: "blur(4px)",
      "& .MuiChip-label": { px: 1.5 },
    },

    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "200px",
    },

    emptyNotifications: {
      textAlign: "center",
      py: 8,
      px: 3,
      backgroundColor: "#FAFAFA",
    },

    emptyIconContainer: {
      width: 100,
      height: 100,
      borderRadius: "50%",
      bgcolor: blueColors.lightest,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 3,
      mx: "auto",
      boxShadow: `0 6px 20px ${alpha(blueColors.main, 0.2)}`,
    },

    notificationsContainer: {
      p: 3,
      backgroundColor: alpha(blueColors.lightest, 0.3),
    },

    notificationCard: {
      display: "flex",
      alignItems: "center",
      borderRadius: 2,
      p: 2.5,
      mb: 2,
      border: "1px solid",
      borderColor: alpha(blueColors.main, 0.1),
      backgroundColor: "#FFFFFF",
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: alpha(blueColors.main, 0.5),
        backgroundColor: alpha(blueColors.lightest, 0.5),
        boxShadow: `0 4px 12px ${alpha(blueColors.main, 0.1)}`,
        transform: "translateY(-2px)",
      },
    },

    iconContainer: (bgColor) => ({
      width: 46,
      height: 46,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 1.5,
      backgroundColor: bgColor,
      mr: 2,
      transition: "all 0.2s ease",
    }),

    collaborateurName: {
      fontWeight: 600,
      color: blueColors.dark,
      mb: 0.5,
    },

    notificationContent: {
      color: "#424242",
    },

    dateChip: {
      backgroundColor: alpha(blueColors.main, 0.1),
      color: blueColors.dark,
      fontWeight: 500,
      mr: 2,
      border: `1px solid ${alpha(blueColors.main, 0.2)}`,
    },

    deleteButton: {
      color: "#9E9E9E",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#FFEBEE",
        color: "#D32F2F",
      },
    },

    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: alpha("#fff", 0.7),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },

    paginationContainer: {
      display: "flex",
      justifyContent: "center",
      py: 2.5,
      backgroundColor: alpha(blueColors.lightest, 0.4),
    },

    pagination: {
      "& .MuiPaginationItem-root": {
        color: blueColors.main,
        borderColor: alpha(blueColors.main, 0.2),
        fontWeight: 500,
      },
      "& .Mui-selected": {
        backgroundColor: `${alpha(blueColors.main, 0.12)} !important`,
        borderColor: blueColors.main,
      },
    },

    // Utility function to categorize notifications with différentes nuances de bleu
    getCategoryAndIcon: (notification) => {
      const categorizedNotifications = {
        Projet: {
          icon: "work",
          color: "#0D47A1", // Bleu foncé
          bgColor: "#E3F2FD", // Bleu très clair
        },
        Rappel: {
          icon: "alarm",
          color: "#1976D2", // Bleu médium
          bgColor: "#BBDEFB", // Bleu clair
        },
        Message: {
          icon: "chat_bubble_outline",
          color: "#2196F3", // Bleu standard
          bgColor: "#E1F5FE", // Bleu très clair
        },
        Système: {
          icon: "settings",
          color: "#0288D1", // Bleu clair
          bgColor: "#E1F5FE", // Bleu très clair
        },
      };

      // Determine category based on notification content
      const category =
        Object.keys(categorizedNotifications).find((cat) =>
          notification.contenu?.toLowerCase().includes(cat.toLowerCase())
        ) || "Système";

      return categorizedNotifications[category];
    },
  };
};

export default createNotificationStyles;
