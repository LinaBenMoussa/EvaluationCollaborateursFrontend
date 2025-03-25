/* eslint-disable react/prop-types */
import { alpha } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { exportToExcel } from "functions/exportToExcel";
import exceller from "assets/images/icons/flags/exceller.png";
import FilterListIcon from "@mui/icons-material/FilterList";

export const HistoriqueHeader = ({ rows, activeFilters, setOpenFilter, theme }) => {
  return (
    <MDBox
      mx={0}
      mt={0}
      py={3}
      px={3}
      variant="gradient"
      bgColor="info"
      borderRadius="0"
      coloredShadow="none"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <MDBox>
        <MDTypography variant="h5" color="white" fontWeight="bold">
          Historique des Pointages
        </MDTypography>
        <MDTypography variant="caption" color="white" fontWeight="light">
          Gérez et consultez tous vos enregistrements
        </MDTypography>
      </MDBox>
      <MDBox display="flex" alignItems="center">
        <Tooltip title="Exporter en Excel">
          <IconButton
            color="white"
            onClick={() => exportToExcel(rows, "Liste_des_Pointages")}
            sx={{
              mr: 1,
              backgroundColor: alpha("#fff", 0.1),
              "&:hover": { backgroundColor: alpha("#fff", 0.2) },
            }}
          >
            <img src={exceller} alt="Exporter en Excel" style={{ width: 25, height: 25 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Filtres avancés">
          <Badge
            badgeContent={activeFilters}
            color="secondary"
            sx={{
              "& .MuiBadge-badge": { fontSize: 10 },
            }}
          >
            <IconButton
              color="white"
              onClick={() => setOpenFilter(true)}
              sx={{
                backgroundColor: alpha("#fff", 0.1),
                "&:hover": { backgroundColor: alpha("#fff", 0.2) },
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Badge>
        </Tooltip>
      </MDBox>
    </MDBox>
  );
};
