import { useGetCollaborateursByManagerQuery } from "store/api/userApi";
import CloseIcon from "@mui/icons-material/Close";
import { Drawer, Grid, IconButton, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import AutocompleteField from "layouts/shared/autocompleteField";
import MDButton from "components/MDButton";

/* eslint-disable react/prop-types */

export const FiltreAvancee = ({
  managerId,
  openFilter,
  setOpenFilter,
  isMobile,
  theme,
  setSelectedCollaborateur,
  setCollaborateurId,
  selectedCollaborateur,
  selectedDate1,
  setSelectedDate1,
  setSelectedDate2,
  selectedDate2,
  handleApplyFilters,
  handleResetFilters,
  alpha,
  setFilterType,
}) => {
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
        <MDBox
          p={3}
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5" fontWeight="bold">
              Filtres avancés
            </MDTypography>
            <IconButton
              onClick={() => setOpenFilter(false)}
              sx={{
                backgroundColor: alpha(theme.palette.text.primary, 0.05),
                "&:hover": { backgroundColor: alpha(theme.palette.text.primary, 0.1) },
              }}
            >
              <CloseIcon />
            </IconButton>
          </MDBox>
        </MDBox>

        <MDBox
          p={3}
          display="flex"
          flexDirection="column"
          gap={4}
          flex="1"
          overflow="auto"
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: alpha(theme.palette.text.primary, 0.2),
              borderRadius: "4px",
            },
          }}
        >
          {/* Filtre collaborateur */}
          <MDBox>
            <MDTypography variant="subtitle1" fontWeight="medium" mb={1} color="text">
              Collaborateur
            </MDTypography>
            <AutocompleteField
              useFetchHook={() => useGetCollaborateursByManagerQuery(managerId)}
              fullWidth
              setSelectedItem={setSelectedCollaborateur}
              setIdItem={setCollaborateurId}
              selectedItem={selectedCollaborateur}
              label="Choisir un collaborateur"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </MDBox>
          {/* Filtre de période */}
          <MDBox>
            <MDTypography variant="subtitle1" fontWeight="medium" mb={1} color="text">
              Période personnalisée
            </MDTypography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="De"
                  InputLabelProps={{ shrink: true }}
                  value={selectedDate1}
                  onChange={(e) => {
                    setSelectedDate1(e.target.value);
                    setFilterType("custom");
                  }}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="À"
                  InputLabelProps={{ shrink: true }}
                  value={selectedDate2}
                  onChange={(e) => {
                    setSelectedDate2(e.target.value);
                    setFilterType("custom");
                  }}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>

        {/* Boutons d'action */}
        <MDBox
          p={3}
          display="flex"
          justifyContent="space-between"
          sx={{
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <MDButton
            color="error"
            onClick={handleResetFilters}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "medium",
              px: 3,
            }}
          >
            Réinitialiser
          </MDButton>
          <MDButton
            color="info"
            onClick={handleApplyFilters}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "medium",
              px: 3,
            }}
          >
            Appliquer
          </MDButton>
        </MDBox>
      </MDBox>
    </Drawer>
  );
};
