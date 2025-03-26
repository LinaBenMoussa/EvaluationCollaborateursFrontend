const getStyles = (theme, alpha, isMobile) => ({
  drawerPaper: {
    width: { xs: "100%", sm: 400 },
    padding: 0,
    borderTopLeftRadius: isMobile ? 0 : "15px",
    borderBottomLeftRadius: isMobile ? 0 : "15px",
  },
  header: {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    backgroundColor: theme.palette.background.default,
  },
  iconButton: {
    backgroundColor: alpha(theme.palette.text.primary, 0.05),
    "&:hover": { backgroundColor: alpha(theme.palette.text.primary, 0.1) },
  },
  contentBox: {
    p: 3,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
    overflow: "auto",
    "&::-webkit-scrollbar": { width: "8px" },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: alpha(theme.palette.text.primary, 0.2),
      borderRadius: "4px",
    },
  },
  footer: {
    p: 3,
    display: "flex",
    justifyContent: "space-between",
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    backgroundColor: theme.palette.background.default,
  },
  button: {
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: "medium",
    px: 3,
  },
});

export default getStyles;
