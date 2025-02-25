//de DD/MM/YYYY hh:mm à yy-mm-dd
export function convertDateFormat(input) {
  if (!input) return "";
  const [datePart] = input.split(" ");
  const parts = datePart.split("/");
  if (parts.length !== 3) return "";
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
}

// chaine iso to dd/MM/yyyy
export function formatDate(date) {
  if (date == null) {
    return "";
  }
  const d = new Date(date);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateWithTime(date) {
  if (date == null) {
    return "";
  }
  const d = new Date(date);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const formatTime = (timeString) => {
  if (!timeString) return "";
  return timeString.substring(0, 5); // Garde seulement HH:MM
};

export function isDateInRange(date, start, end) {
  console.log("isDateInRange", date, start, end);
  return start && end
    ? date >= start && date <= end
    : start
    ? date >= start
    : end
    ? date <= end
    : true;
}

export const isSameDate = (dateInput1, dateInput2) => {
  const date1 = new Date(dateInput1);
  const date2 = new Date(dateInput2);

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
