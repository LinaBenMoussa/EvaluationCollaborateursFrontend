/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import { formatTime } from "functions/dateTime";
import { formatDate } from "functions/dateTime";
import { useMemo } from "react";
import { useGetSaisieTempsQuery } from "store/api/saisieTemps";

export function useSaisiesTableData(id) {
  const { data: saisies = [], isLoading } = useGetSaisieTempsQuery(id);

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "heures", accessor: "heures", align: "center" },
      { Header: "commentaire", accessor: "commentaire", align: "center" },
      { Header: "collaborateur", accessor: "collaborateur", align: "center" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      saisies.map((saisie) => ({
        id: saisie.id,
        date: formatDate(saisie.date),
        heures: saisie.heures,
        commentaire: saisie.commentaire,
        collaborateur: `${saisie.collaborateur.nom} ${saisie.collaborateur.prenom}`,
      })),
    [saisies]
  );

  return { columns, rows, isLoading };
}
