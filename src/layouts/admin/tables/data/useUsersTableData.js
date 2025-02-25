/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useMemo } from "react";
import MDTypography from "components/MDTypography";
import { useGetByRoleQuery } from "store/api/userApi";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";

export function useUsersTableData(role) {
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useGetByRoleQuery(role);
  console.log(users);

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "nom", accessor: "nom", align: "center" },
      { Header: "prenom", accessor: "prenom", align: "center" },
      { Header: "username", accessor: "username", align: "center" },
      { Header: "id_redmine", accessor: "id_redmine", align: "center" },
      { Header: "id_bitrix24", accessor: "id_bitrix24", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        username: user.username,
        id_redmine: user.id_redmine,
        id_bitrix24: user.id_bitrix24,
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            <MDButton onClick={() => navigate(`/edituser/${user.id}`)}> Edit</MDButton>
          </MDTypography>
        ),
      })),
    [users]
  );

  return { columns, rows, isLoading };
}
