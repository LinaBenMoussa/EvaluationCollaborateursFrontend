/* eslint-disable react/prop-types */
import { CircularProgress, Box, TablePagination } from "@mui/material";
import MDBox from "components/MDBox";
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
            entriesPerPage={false}
            showTotalEntries={false}
            canSearch={false}
            noEndBorder={true}
            sx={classes.dataTable}
          />

          {/* Pagination */}
          {total > rowsPerPage && (
            <MDBox className={classes.paginationContainer}>
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  // Convertir la valeur en nombre entier
                  const newRowsPerPage = parseInt(event.target.value, 10);
                  onRowsPerPageChange({
                    target: {
                      value: newRowsPerPage,
                    },
                  });
                }}
                rowsPerPageOptions={[5, 10, 15, 20, 25]}
                labelRowsPerPage="Lignes par page:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
                }
                sx={classes.pagination}
              />
            </MDBox>
          )}
        </>
      )}
    </>
  );
};

export default Table;
