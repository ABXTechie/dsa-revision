const intervals = [1, 3, 7, 14, 30];

export const getToday = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const addDays = (dateString, days) => {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);

  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, "0");
  const newDay = String(date.getDate()).padStart(2, "0");

  return `${newYear}-${newMonth}-${newDay}`;
};

export const getNextRevisionDate = (solvedDate, revisionNumber) => {
  const interval = intervals[revisionNumber - 1];

  if (!interval) {
    return null;
  }

  return addDays(solvedDate, interval);
};

export { intervals };