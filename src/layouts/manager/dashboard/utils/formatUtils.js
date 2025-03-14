export const formatDate = (date) => {
  if (!date) return "";
  if (typeof date === "string") return date;
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
};

export const formatTime = (hours) => {
  if (hours === null || hours === undefined) return "N/A";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h${m > 0 ? ` ${m}m` : ""}`;
};

export const safeNumberFormat = (value, decimals = 1) => {
  if (value === null || value === undefined) return "N/A";
  return typeof value === "number" ? value.toFixed(decimals) : "N/A";
};
