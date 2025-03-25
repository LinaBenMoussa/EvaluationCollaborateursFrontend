/* eslint-disable react/prop-types */
import { CircularProgress, Box, TablePagination } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import TableStyles from "./tableStyle";

const Table = ({
  theme,
  isLoading,
  columns,
  rows,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  isMobile,
}) => {
  const classes = TableStyles(theme);

  return (
    <>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: "300px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DataTable
            table={{ columns, rows }}
            isSorted={true}
            entriesPerPage={true}
            showTotalEntries={true}
            canSearch={true}
            noEndBorder={true}
            sx={classes.dataTable}
          />

          {/* Pagination */}
          <MDBox className={classes.paginationContainer}>
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={onPageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={onRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Lignes par page:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
              }
              sx={classes.pagination}
            />
          </MDBox>

          {/* Informations sur la pagination */}
          <MDBox
            className={isMobile ? classes.infoBoxMobile : classes.infoBox} // Choisir le style en fonction de l'écran
          >
            <MDTypography variant="body2" color="text">
              Affichage de <strong>{rows.length}</strong> pointages
              {total > 0 && ` sur un total de <strong>${total}</strong>`}
            </MDTypography>
          </MDBox>
        </>
      )}
    </>
  );
};

export default Table;
