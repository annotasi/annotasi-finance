/**
 * Formats a base-10 integer Rupiah string with thousand separators using pure
 * string manipulation (never Number/parseFloat), so precision holds above
 * Number.MAX_SAFE_INTEGER.
 */
export function formatIDR(amount: string): string {
  const negative = amount.startsWith("-");
  const digits = negative ? amount.slice(1) : amount;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/gu, ".");
  return `${negative ? "-" : ""}Rp${grouped}`;
}

const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * Renders a date-only "YYYY-MM-DD" string without constructing a JS Date
 * (which would apply local-timezone interpretation and can shift the day).
 */
export function formatDateOnly(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (match === null) return value;
  const [, year, month, day] = match;
  const monthName = INDONESIAN_MONTHS[Number(month) - 1] ?? month;
  return `${Number(day)} ${monthName} ${year}`;
}
