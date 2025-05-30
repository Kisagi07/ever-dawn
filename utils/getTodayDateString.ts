const getTodayDateString = (timeZone:string, locale:string) => {
  const now = new Date();
  
  const formatter = new Intl.DateTimeFormat(locale,{timeZone, year: "numeric", month: "2-digit", "day": "2-digit"});

  // Format returns "YYYY-MM-DD" for "en-CA" locale
  const parts = formatter.formatToParts(now);
  const year = parts.find(p => p.type === "year")?.value;
  const month = parts.find(p => p.type === "month")?.value;
  const day = parts.find(p => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
};
export default getTodayDateString;
