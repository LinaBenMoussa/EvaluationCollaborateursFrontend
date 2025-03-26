/* eslint-disable react/prop-types */
import Tooltip from "@mui/material/Tooltip";
import MDTypography from "components/MDTypography";
import { exportToExcel } from "functions/exportToExcel";
import exceller from "assets/images/icons/flags/exceller.png";
import FilterListIcon from "@mui/icons-material/FilterList";
import { HeaderContainer, ExportButton, FilterButton, CustomBadge } from "./headerStyle";

export const Header = ({ rows, title, filtreExiste, activeFilters, setOpenFilter }) => {
  return (
    <HeaderContainer>
      <MDTypography variant="h5" color="white" fontWeight="bold">
        {title}
      </MDTypography>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="Exporter en Excel">
          <ExportButton onClick={() => exportToExcel(rows, "Liste_des_Pointages")}>
            <img src={exceller} alt="Exporter en Excel" style={{ width: 25, height: 25 }} />
          </ExportButton>
        </Tooltip>

        {filtreExiste && (
          <Tooltip title="Filtres avancés">
            <CustomBadge badgeContent={activeFilters} color="secondary">
              <FilterButton onClick={() => setOpenFilter(true)}>
                <FilterListIcon />
              </FilterButton>
            </CustomBadge>
          </Tooltip>
        )}
      </div>
    </HeaderContainer>
  );
};
