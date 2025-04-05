/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import MDTypography from "components/MDTypography";
import FilterListIcon from "@mui/icons-material/FilterList";
import { HeaderContainer, FilterButton, CustomBadge } from "./headerStyle";
import { IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { STATUS_OPTIONS } from "layouts/manager/issues/constants";
import { exportToExcel } from "functions/exportToExcel";

export const Header = ({
  columns,
  rows,
  title,
  filtreExiste,
  activeFilters,
  setOpenFilter,
  fileName,
  dialog: ExportDialog,
}) => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const handleOpenExportDialog = () => {
    if (!ExportDialog) {
      exportToExcel(rows, fileName);
    } else {
      setExportDialogOpen(true);
    }
  };

  const handleCloseExportDialog = () => {
    setExportDialogOpen(false);
  };

  return (
    <HeaderContainer>
      <MDTypography variant="h5" color="white" fontWeight="bold">
        {title}
      </MDTypography>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="Exporter en Excel">
          <IconButton color="white" onClick={handleOpenExportDialog}>
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

      {ExportDialog && (
        <ExportDialog
          open={exportDialogOpen}
          onClose={handleCloseExportDialog}
          rows={rows}
          columns={columns}
          fileName={fileName}
          statusOptions={STATUS_OPTIONS}
        />
      )}
    </HeaderContainer>
  );
};
