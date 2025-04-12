import { alpha } from "@mui/material/styles";

const TableStyles = (theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
  },
  dataTable: {
    "& .MuiTableRow-root:hover": {
      backgroundColor: alpha(theme.palette.info.main, 0.05),
    },
    "& .MuiTableCell-head": {
      backgroundColor: theme.palette.background.default,
      color: "#000000",
      fontWeight: "bold",
    },
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "16px",
  },
  pagination: {
    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
      margin: 0,
    },
  },
  infoBox: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: theme.palette.background.default,
    borderRadius: "10px",
  },
  infoBoxMobile: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "16px",
    backgroundColor: theme.palette.background.default,
    borderRadius: "10px",
  },
});

export default TableStyles;
