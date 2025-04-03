/* eslint-disable react/prop-types */
import Tooltip from "@mui/material/Tooltip";
import MDTypography from "components/MDTypography";
import { exportToExcel } from "functions/exportToExcel";
import FilterListIcon from "@mui/icons-material/FilterList";
import { HeaderContainer, FilterButton, CustomBadge } from "./headerStyle";
import { IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export const Header = ({ rows, title, filtreExiste, activeFilters, setOpenFilter, fileName }) => {
  return (
    <HeaderContainer>
      <MDTypography variant="h5" color="white" fontWeight="bold">
        {title}
      </MDTypography>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="Exporter en Excel">
          <IconButton color="white" onClick={() => exportToExcel(rows, fileName)}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>

        {filtreExiste && (
          <Tooltip title="Filtres avancés">
            <CustomBadge badgeContent={activeFilters} color="secondary">
              <FilterButton color="white" onClick={() => setOpenFilter(true)}>
                <FilterListIcon />
              </FilterButton>
            </CustomBadge>
          </Tooltip>
        )}
      </div>
    </HeaderContainer>
  );
};
