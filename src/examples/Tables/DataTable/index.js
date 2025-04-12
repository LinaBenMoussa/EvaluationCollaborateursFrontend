/* eslint-disable react/prop-types */
import { useMemo, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useTable, useGlobalFilter, useAsyncDebounce, useSortBy, usePagination } from "react-table";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";

function DataTable({
  canSearch,
  showTotalEntries,
  table,
  isSorted,
  noEndBorder,
  tableTitle,
  tableDescription,
  elevation,
  colorMode,
  stripedRows,
  hoverEffect,
  maxHeight,
  enablePagination,
  pageSize: initialPageSize,
  pageSizeOptions,
  initialHiddenColumns,
  enableExport,
  enableColumnVisibility,
  rowActions,
  onRowClick,
  emptyMessage,
  refreshAction,
}) {
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);
  const tableContainerRef = useRef(null);

  // Set up pagination
  const defaultPageSize = initialPageSize || 10;

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: defaultPageSize, hiddenColumns: initialHiddenColumns || [] },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setGlobalFilter,
    page,
    rows,
    pageCount,
    gotoPage,
    setPageSize,
    state: { globalFilter, pageIndex, pageSize },
    allColumns,
    toggleHideColumn,
  } = tableInstance;

  // Search input value state
  const [search, setSearch] = useState(globalFilter);

  // Scroll shadow states
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  // Column visibility menu state
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle scroll events to show/hide shadows
  const handleScroll = (event) => {
    const container = event.target;
    setShowLeftShadow(container.scrollLeft > 0);
    setShowRightShadow(container.scrollLeft < container.scrollWidth - container.clientWidth);
  };

  // Check scroll shadow on initial load
  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      setShowRightShadow(container.scrollWidth > container.clientWidth);
    }
  }, [rows, pageSize]);

  // Search input state handle
  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 100);

  // A function that sets the sorted value for the table
  const setSortedValue = (column) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  // Calculate zebra stripes for rows if enabled
  const getRowStyle = (index) => {
    if (!stripedRows) return {};
    return index % 2 === 0
      ? {
          backgroundColor:
            colorMode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
        }
      : {};
  };

  // Handle column visibility menu
  const handleColumnMenuOpen = (event) => {
    setColumnMenuAnchor(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
  };

  // Handle refresh action with loading state
  const handleRefresh = () => {
    if (refreshAction) {
      setIsLoading(true);
      refreshAction().finally(() => {
        setTimeout(() => setIsLoading(false), 500);
      });
    }
  };

  // Calculate which rows to display based on pagination
  const displayRows = enablePagination ? page : rows;

  // Handle page change
  const handlePageChange = (event, value) => {
    gotoPage(value - 1);
  };

  // Handle page size change
  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
  };

  return (
    <Box sx={{ position: "relative" }}>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: elevation ? elevation : "none",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: colorMode === "dark" ? "#1a2035" : "#fff",
          position: "relative",
          border:
            colorMode === "dark"
              ? "1px solid rgba(255,255,255,0.05)"
              : "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {/* Table header with title and search */}
        {(tableTitle || canSearch || enableColumnVisibility || refreshAction) && (
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={3}
            sx={{
              borderBottom: "1px solid",
              borderColor: colorMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              position: "sticky",
              top: 0,
              zIndex: 2,
              backgroundColor: colorMode === "dark" ? "#1a2035" : "#fff",
            }}
          >
            <MDBox display="flex" alignItems="center">
              {tableTitle && (
                <MDBox mr={3}>
                  <MDTypography
                    variant="h6"
                    fontWeight="medium"
                    color={colorMode === "dark" ? "white" : "dark"}
                  >
                    {tableTitle}
                  </MDTypography>
                  {tableDescription && (
                    <MDTypography variant="button" color="text">
                      {tableDescription}
                    </MDTypography>
                  )}
                </MDBox>
              )}

              {refreshAction && (
                <Tooltip title="Rafraîchir">
                  <IconButton
                    onClick={handleRefresh}
                    disabled={isLoading}
                    sx={{
                      mr: 1,
                      color: colorMode === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                    }}
                  >
                    <Icon
                      sx={{
                        animation: isLoading ? "spin 1s linear infinite" : "none",
                        "@keyframes spin": {
                          "0%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(360deg)" },
                        },
                      }}
                    >
                      refresh
                    </Icon>
                  </IconButton>
                </Tooltip>
              )}
            </MDBox>

            <MDBox display="flex" alignItems="center">
              {canSearch && (
                <MDBox width="12rem" mr={enableColumnVisibility || enableExport ? 2 : 0}>
                  <MDInput
                    placeholder="Rechercher..."
                    value={search}
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon fontSize="small" color="text">
                            search
                          </Icon>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor:
                            colorMode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                        },
                        "&:hover fieldset": {
                          borderColor:
                            colorMode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
                        },
                      },
                    }}
                    onChange={({ currentTarget }) => {
                      setSearch(currentTarget.value);
                      onSearchChange(currentTarget.value);
                    }}
                  />
                </MDBox>
              )}

              {enableColumnVisibility && (
                <Tooltip title="Colonnes visibles">
                  <IconButton
                    onClick={handleColumnMenuOpen}
                    sx={{
                      mr: enableExport ? 2 : 0,
                      color: colorMode === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                    }}
                  >
                    <Icon>view_column</Icon>
                  </IconButton>
                </Tooltip>
              )}

              {enableExport && (
                <MDButton
                  variant="outlined"
                  color={colorMode === "dark" ? "white" : "info"}
                  size="small"
                  startIcon={<Icon>download</Icon>}
                >
                  Exporter
                </MDButton>
              )}

              <Menu
                anchorEl={columnMenuAnchor}
                open={Boolean(columnMenuAnchor)}
                onClose={handleColumnMenuClose}
                PaperProps={{
                  sx: {
                    maxHeight: 300,
                    backgroundColor: colorMode === "dark" ? "#1a2035" : "#fff",
                    color: colorMode === "dark" ? "white" : "inherit",
                    border:
                      colorMode === "dark"
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "1px solid rgba(0,0,0,0.1)",
                  },
                }}
              >
                {allColumns.map((column) => (
                  <MenuItem
                    key={column.id}
                    onClick={() => toggleHideColumn(column.id)}
                    sx={{
                      color: colorMode === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                      "&:hover": {
                        backgroundColor:
                          colorMode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <Box component="span" display="flex" alignItems="center">
                      <Icon fontSize="small" sx={{ mr: 1 }}>
                        {column.isVisible ? "check_box" : "check_box_outline_blank"}
                      </Icon>
                      {column.Header}
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </MDBox>
          </MDBox>
        )}

        {/* Scroll container for table */}
        <Box
          ref={tableContainerRef}
          onScroll={handleScroll}
          sx={{
            overflowX: "auto",
            maxHeight: maxHeight || "none",
            position: "relative",
            "&::-webkit-scrollbar": {
              height: "8px",
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: colorMode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: colorMode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: colorMode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
              },
            },
          }}
        >
          {/* Left shadow indicator for scroll */}
          {showLeftShadow && (
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "15px",
                zIndex: 1,
                pointerEvents: "none",
                background: `linear-gradient(90deg, ${
                  colorMode === "dark" ? "rgba(26, 32, 53, 0.7)" : "rgba(255, 255, 255, 0.7)"
                } 0%, ${
                  colorMode === "dark" ? "rgba(26, 32, 53, 0)" : "rgba(255, 255, 255, 0)"
                } 100%)`,
              }}
            />
          )}

          {/* Right shadow indicator for scroll */}
          {showRightShadow && (
            <Box
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "15px",
                zIndex: 1,
                pointerEvents: "none",
                background: `linear-gradient(270deg, ${
                  colorMode === "dark" ? "rgba(26, 32, 53, 0.7)" : "rgba(255, 255, 255, 0.7)"
                } 0%, ${
                  colorMode === "dark" ? "rgba(26, 32, 53, 0)" : "rgba(255, 255, 255, 0)"
                } 100%)`,
              }}
            />
          )}

          {/* Main table */}
          <Table
            {...getTableProps()}
            sx={{
              width: "100%",
              backgroundColor: colorMode === "dark" ? "#1a2035" : "#fff",
              color: colorMode === "dark" ? "white" : "inherit",
              tableLayout: "auto",
            }}
          >
            <MDBox
              component="thead"
              sx={{
                backgroundColor:
                  colorMode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                borderBottom: "1px solid",
                borderColor: colorMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              {headerGroups.map((headerGroup, key) => (
                <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, idx) => (
                    <DataTableHeadCell
                      key={idx}
                      {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                      width={column.width ? column.width : "auto"}
                      align={column.align ? column.align : "center"}
                      sorted={setSortedValue(column)}
                      sx={{
                        color: "#000000",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.025rem",
                        padding: "16px",
                        position: "sticky",
                        top: 0,
                        backgroundColor:
                          colorMode === "dark"
                            ? "rgba(26, 32, 53, 0.95)"
                            : "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(4px)",
                        boxShadow: "0 1px 0 0 rgba(0, 0, 0, 0.1)",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        maxWidth: "200px",
                        cursor: isSorted ? "pointer" : "default",
                        transition: "all 0.2s",
                        "&:hover": isSorted
                          ? {
                              backgroundColor:
                                colorMode === "dark"
                                  ? "rgba(255,255,255,0.08)"
                                  : "rgba(0,0,0,0.04)",
                            }
                          : {},
                      }}
                    >
                      <MDBox display="flex" alignItems="center">
                        {column.render("Header")}
                        {isSorted && column.isSorted && (
                          <Icon fontSize="small" sx={{ ml: 0.5 }}>
                            {column.isSortedDesc ? "arrow_downward" : "arrow_upward"}
                          </Icon>
                        )}
                      </MDBox>
                    </DataTableHeadCell>
                  ))}
                  {rowActions && (
                    <DataTableHeadCell width="100px" align="center">
                      Actions
                    </DataTableHeadCell>
                  )}
                </TableRow>
              ))}
            </MDBox>
            <TableBody {...getTableBodyProps()}>
              {displayRows.length > 0 ? (
                displayRows.map((row, key) => {
                  prepareRow(row);
                  return (
                    <TableRow
                      key={key}
                      {...row.getRowProps()}
                      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                      sx={{
                        ...getRowStyle(key),
                        transition: "all 0.2s",
                        cursor: onRowClick ? "pointer" : "default",
                        "&:hover": hoverEffect
                          ? {
                              backgroundColor:
                                colorMode === "dark"
                                  ? "rgba(255,255,255,0.08)"
                                  : "rgba(0,0,0,0.04)",
                              boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.05)",
                            }
                          : {},
                        borderBottom: "1px solid",
                        borderColor:
                          colorMode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      }}
                    >
                      {row.cells.map((cell, idx) => (
                        <DataTableBodyCell
                          key={idx}
                          noBorder={noEndBorder && displayRows.length - 1 === key}
                          align={cell.column.align ? cell.column.align : "right"}
                          {...cell.getCellProps()}
                          sx={{
                            color: colorMode === "dark" ? "rgba(255,255,255,0.7)" : "inherit",
                            padding: "16px",
                            fontSize: "0.875rem",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            maxWidth: "200px",
                          }}
                        >
                          {cell.render("Cell")}
                        </DataTableBodyCell>
                      ))}
                      {rowActions && (
                        <DataTableBodyCell
                          noBorder={noEndBorder && displayRows.length - 1 === key}
                          align="center"
                          sx={{
                            color: colorMode === "dark" ? "rgba(255,255,255,0.7)" : "inherit",
                            padding: "16px",
                            fontSize: "0.875rem",
                            wwhiteSpace: "normal",
                            wordWrap: "break-word",
                            maxWidth: "200px",
                          }}
                        >
                          <MDBox display="flex" justifyContent="center" gap={1}>
                            {rowActions(row.original)}
                          </MDBox>
                        </DataTableBodyCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <DataTableBodyCell
                    colSpan={columns.length + (rowActions ? 1 : 0)}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <MDBox textAlign="center" py={3}>
                      <Icon
                        sx={{
                          fontSize: 48,
                          color: colorMode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                          mb: 2,
                        }}
                      >
                        search_off
                      </Icon>
                      <MDTypography variant="h6" color="text">
                        {emptyMessage || "Aucune donnée disponible"}
                      </MDTypography>
                    </MDBox>
                  </DataTableBodyCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Table footer with total entries and pagination */}
        {(showTotalEntries || enablePagination) && rows.length > 0 && (
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={3}
            sx={{
              borderTop: "1px solid",
              borderColor: colorMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              position: "sticky",
              bottom: 0,
              backgroundColor: colorMode === "dark" ? "#1a2035" : "#fff",
              zIndex: 2,
            }}
          >
            {showTotalEntries && (
              <MDBox>
                <MDTypography
                  variant="button"
                  color={colorMode === "dark" ? "white" : "secondary"}
                  fontWeight="regular"
                >
                  Affichage de{" "}
                  {enablePagination
                    ? `${pageIndex * pageSize + 1}-${Math.min(
                        (pageIndex + 1) * pageSize,
                        rows.length
                      )} sur ${rows.length}`
                    : `${rows.length}`}{" "}
                  entrée{rows.length > 1 ? "s" : ""}
                </MDTypography>
              </MDBox>
            )}

            {enablePagination && (
              <MDBox display="flex" alignItems="center">
                {pageSizeOptions && (
                  <FormControl
                    variant="outlined"
                    size="small"
                    sx={{
                      mr: 2,
                      minWidth: 80,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "& fieldset": {
                          borderColor:
                            colorMode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                        },
                      },
                    }}
                  >
                    <Select
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      sx={{
                        color: colorMode === "dark" ? "white" : "inherit",
                        fontSize: "0.875rem",
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: colorMode === "dark" ? "#1a2035" : "#fff",
                            color: colorMode === "dark" ? "white" : "inherit",
                          },
                        },
                      }}
                    >
                      {pageSizeOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option} par page
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <Pagination
                  count={pageCount}
                  page={pageIndex + 1}
                  onChange={handlePageChange}
                  shape="rounded"
                  color={colorMode === "dark" ? "primary" : "info"}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: colorMode === "dark" ? "rgba(255,255,255,0.7)" : undefined,
                      "&.Mui-selected": {
                        color: colorMode === "dark" ? "white" : undefined,
                      },
                    },
                  }}
                />
              </MDBox>
            )}
          </MDBox>
        )}
      </TableContainer>
    </Box>
  );
}

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  canSearch: false,
  showTotalEntries: true,
  isSorted: true,
  noEndBorder: false,
  tableTitle: null,
  tableDescription: null,
  elevation: 1,
  colorMode: "light",
  stripedRows: true,
  hoverEffect: true,
  maxHeight: null,
  enablePagination: false,
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50],
  enableExport: false,
  enableColumnVisibility: true,
  rowActions: null,
  onRowClick: null,
  emptyMessage: "Aucune donnée disponible",
  refreshAction: null,
  initialHiddenColumns: [],
};

// Typechecking props for the DataTable
DataTable.propTypes = {
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
  tableTitle: PropTypes.string,
  tableDescription: PropTypes.string,
  elevation: PropTypes.number,
  colorMode: PropTypes.oneOf(["light", "dark"]),
  stripedRows: PropTypes.bool,
  hoverEffect: PropTypes.bool,
  maxHeight: PropTypes.string,
  enablePagination: PropTypes.bool,
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  enableExport: PropTypes.bool,
  enableColumnVisibility: PropTypes.bool,
  rowActions: PropTypes.func,
  onRowClick: PropTypes.func,
  emptyMessage: PropTypes.string,
  refreshAction: PropTypes.func,
  initialHiddenColumns: PropTypes.arrayOf(PropTypes.string),
};

export default DataTable;
