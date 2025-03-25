import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MDBox from "components/MDBox";

export const HeaderContainer = styled(MDBox)(({ theme }) => ({
  margin: 0,
  marginTop: 0,
  padding: theme.spacing(3),
  variant: "gradient",
  backgroundColor: theme.palette.info.main,
  borderRadius: 0,
  boxShadow: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

export const ExportButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(1),
  backgroundColor: theme.palette.common.white + "1A", // alpha 10%
  "&:hover": {
    backgroundColor: theme.palette.common.white + "33", // alpha 20%
  },
}));

export const FilterButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.common.white + "1A",
  "&:hover": {
    backgroundColor: theme.palette.common.white + "33",
  },
}));

export const CustomBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    fontSize: 10,
  },
}));
