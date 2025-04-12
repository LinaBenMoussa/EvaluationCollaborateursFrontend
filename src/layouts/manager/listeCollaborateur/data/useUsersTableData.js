/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { useMemo } from "react";
import { useGetCollaborateursByManagerQuery } from "store/api/userApi";

export function useUsersTableData(managerId) {
  const { data: users = [], isLoading } = useGetCollaborateursByManagerQuery(managerId);
  console.log(users);

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "nom", accessor: "nom", align: "left" },
      { Header: "prenom", accessor: "prenom", align: "left" },
      { Header: "Nom d'utilisateur", accessor: "username", align: "left" },
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
      })),
    [users]
  );

  return { columns, rows, isLoading };
}
