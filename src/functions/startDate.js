export const getStartDate = (periodType) => {
  const currentDate = new Date();

  if (periodType === "today") {
    return new Date(currentDate.setHours(0, 0, 0, 0));
  } else if (periodType === "yesterday") {
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    return new Date(yesterday.setHours(0, 0, 0, 0));
  } else if (periodType === "month") {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  } else if (periodType === "year") {
    return new Date(currentDate.getFullYear(), 0, 1);
  } else if (periodType === "week") {
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), diff);
  }

  return currentDate;
};
