import * as XLSX from "xlsx";

/**
 * Exporte un tableau d'objets au format Excel (.xlsx).
 * @param {Array<Object>} data - Tableau d'objets à exporter.
 * @param {string} fileName - Nom de fichier sans extension.
 */
export function exportToExcel(data, fileName) {
  const sanitizedData = data.map((item) => {
    const newItem = {};
    Object.keys(item).forEach((key) => {
      const value = item[key];
      // Vérifie si la valeur est un élément React avec des children
      if (typeof value === "object" && value !== null && value.props && value.props.children) {
        // Pour le champ "status", on récupère le deuxième enfant (props.children[1])
        if (Array.isArray(value.props.children) && value.props.children.length > 1) {
          newItem[key] = value.props.children[1];
        } else {
          newItem[key] = Array.isArray(value.props.children)
            ? value.props.children.join(" ")
            : value.props.children.toString();
        }
      } else {
        newItem[key] = value;
      }
    });
    return newItem;
  });

  // Création de la feuille de calcul à partir des données JSON
  const worksheet = XLSX.utils.json_to_sheet(sanitizedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Création d'un lien temporaire pour déclencher le téléchargement
  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `${fileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
