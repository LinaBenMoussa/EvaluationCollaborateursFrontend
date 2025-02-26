import { useState, useMemo, useEffect } from "react";
import { useGetByRoleQuery, useDeleteUserMutation } from "store/api/userApi";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import { Icon } from "@mui/material";

export function useUsersTableData(role) {
  const navigate = useNavigate();
  const { data: users = [], isLoading, refetch } = useGetByRoleQuery(role);
  const [deleteUser] = useDeleteUserMutation();

  // États pour la boîte de dialogue
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    refetch();
  }, [role]);

  const handleOpenDialog = (id) => {
    setSelectedUserId(id);
    setOpen(true);
  };

  // Fermer la boîte de dialogue
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedUserId(null);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (selectedUserId) {
      await deleteUser(selectedUserId);
      refetch();
    }
    handleCloseDialog();
  };

  // Construction des colonnes en fonction du rôle
  const columns = useMemo(() => {
    const baseColumns = [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "nom", accessor: "nom", align: "center" },
      { Header: "prenom", accessor: "prenom", align: "center" },
      { Header: "Nom d'utilisateur", accessor: "username", align: "center" },
    ];

    if (role === "Collaborateur") {
      baseColumns.push(
        { Header: "manager", accessor: "manager", align: "center" },
        { Header: "id_redmine", accessor: "id_redmine", align: "center" },
        { Header: "id_bitrix24", accessor: "id_bitrix24", align: "center" }
      );
    }

    baseColumns.push({ Header: "action", accessor: "action", align: "center" });

    return baseColumns;
  }, [role]);

  const rows = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        username: user.username,
        manager:
          role === "Collaborateur" && user.manager
            ? `${user.manager.nom} ${user.manager.prenom}`
            : null,
        id_redmine: role === "Collaborateur" ? user.id_redmine : null,
        id_bitrix24: role === "Collaborateur" ? user.id_bitrix24 : null,
        action: (
          <>
            <MDButton onClick={() => navigate(`/edituser/${user.id}`)}>
              <Icon sx={{ color: "orange" }}>edit</Icon>
            </MDButton>
            <MDButton onClick={() => handleOpenDialog(user.id)}>
              <Icon sx={{ color: "red" }}>delete</Icon>
            </MDButton>
          </>
        ),
      })),
    [users, navigate, role]
  );

  return { columns, rows, isLoading, open, handleCloseDialog, handleConfirmDelete };
}
