const TIME_ZONE = "Asia/Karachi";

const getDateParts = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value),
  };
};

const localMidnightToUTC = (year: number, month: number, day: number) => {
  return new Date(Date.UTC(year, month - 1, day) - 5 * 60 * 60 * 1000);
};

export const getLocalDateBoundaries = () => {
  const now = new Date();
  const { year, month, day } = getDateParts(now);

  const startOfToday = localMidnightToUTC(year, month, day);

  const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setUTCDate(startOfYesterday.getUTCDate() - 1);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setUTCDate(startOfWeek.getUTCDate() - daysFromMonday);

  const startOfNextWeek = new Date(startOfWeek);
  startOfNextWeek.setUTCDate(startOfNextWeek.getUTCDate() + 7);

  const startOfMonth = localMidnightToUTC(year, month, 1);

  return {
    startOfYesterday,
    startOfToday,
    startOfTomorrow,
    startOfWeek,
    startOfNextWeek,
    startOfMonth,
  };
};
