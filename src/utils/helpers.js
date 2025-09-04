export function formatStayDuration(days) {
  if (days <= 0) return "0 days";

  // Less than or equal to 13 days - show in days
  if (days <= 13) {
    return days === 1 ? "1 day" : `${days} days`;
  }

  // More than 13 days but 6 weeks or less - show in weeks
  const weeks = days / 7;
  if (weeks <= 6) {
    // Round to nearest half week
    const roundedWeeks = Math.round(weeks * 2) / 2;

    if (roundedWeeks === 1) return "1 week";
    if (roundedWeeks % 1 === 0) return `${roundedWeeks} weeks`;
    return `${roundedWeeks} weeks`;
  }

  // More than 6 weeks - show in months (assume 30 days per month)
  const months = days / 30;
  const roundedMonths = Math.round(months * 2) / 2;

  if (roundedMonths === 1) return "1 month";
  if (roundedMonths % 1 === 0) return `${roundedMonths} months`;
  return `${roundedMonths} months`;
}

export function getMinMaxDate(visits) {
  if (!visits || visits.length === 0) {
    return { minDate: null, maxDate: null };
  }

  const allDates = visits
    .filter((visit) => visit.start_date)
    .flatMap((visit) => [
      new Date(visit.start_date),
      visit.end_date ? new Date(visit.end_date) : new Date(visit.start_date),
    ]);

  if (allDates.length === 0) {
    return { minDate: null, maxDate: null };
  }

  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));

  return {
    minDate,
    maxDate,
  };
}
