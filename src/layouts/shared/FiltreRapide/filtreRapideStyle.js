// FiltreRapide.styles.js
import { alpha } from "@mui/material";

const filtreRapideStyles = (theme) => ({
  paper: {
    padding: "16px",
    marginBottom: "24px",
    borderRadius: "10px",
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
  box: (isMobile) => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "stretch" : "center",
    justifyContent: "space-between",
  }),
  button: {
    borderRadius: "8px",
    textTransform: "none",
    paddingY: "8px",
  },
  chip: {
    borderRadius: "6px",
    fontWeight: "medium",
    "& .MuiChip-label": { paddingX: "16px" },
    "& .MuiChip-deleteIcon": { color: "white" },
  },
});

export default filtreRapideStyles;
