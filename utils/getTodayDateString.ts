const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const dateString = `${year}-${month + 1}-${date}`;
  return dateString;
};
export default getTodayDateString;
