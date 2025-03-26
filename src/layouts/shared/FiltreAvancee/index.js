import CloseIcon from "@mui/icons-material/Close";
import { Drawer, IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import getStyles from "./filtreAvanceeStyle";

/* eslint-disable react/prop-types */

export const FiltreAvancee = ({
  openFilter,
  setOpenFilter,
  isMobile,
  theme,
  handleApplyFilters,
  handleResetFilters,
  alpha,
  children, // Ajout des enfants
}) => {
  const styles = getStyles(theme, alpha, isMobile); // Utilisation des styles

  return (
    <Drawer
      anchor="right"
      open={openFilter}
      onClose={() => setOpenFilter(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 400 },
          padding: 0,
          borderTopLeftRadius: isMobile ? 0 : "15px",
          borderBottomLeftRadius: isMobile ? 0 : "15px",
        },
      }}
    >
      <MDBox height="100%" display="flex" flexDirection="column">
        {/* Header */}
        <MDBox p={3} sx={styles.header}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5" fontWeight="bold">
              Filtres avancés
            </MDTypography>
            <IconButton onClick={() => setOpenFilter(false)} sx={styles.iconButton}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </MDBox>

        {/* Contenu dynamique */}
        <MDBox sx={styles.contentBox}>{children}</MDBox>

        {/* Boutons d'action */}
        <MDBox sx={styles.footer}>
          <MDButton
            color="error"
            onClick={handleResetFilters}
            variant="outlined"
            sx={styles.button}
          >
            Réinitialiser
          </MDButton>
          <MDButton color="info" onClick={handleApplyFilters} sx={styles.button}>
            Appliquer
          </MDButton>
        </MDBox>
      </MDBox>
    </Drawer>
  );
};
