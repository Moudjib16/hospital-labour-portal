// Date-only inputs (`type="date"`) are stored and compared as UTC midnight so
// a calendar day stays the same regardless of the server timezone.
export function parseDateOnly(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function endOfDayUtc(value: string): Date {
  return new Date(`${value}T23:59:59.999Z`);
}

export type DateRangeFilter = { gte?: Date; lte?: Date };

export function dateRangeUtc(from?: string, to?: string): DateRangeFilter {
  const range: DateRangeFilter = {};
  if (from) {
    range.gte = parseDateOnly(from);
  }
  if (to) {
    range.lte = endOfDayUtc(to);
  }
  return range;
}

export function ageFrom(
  dateOfBirth: Date,
  relativeTo: Date = new Date()
): number {
  let age = relativeTo.getFullYear() - dateOfBirth.getFullYear();
  const beforeBirthday =
    relativeTo.getMonth() < dateOfBirth.getMonth() ||
    (relativeTo.getMonth() === dateOfBirth.getMonth() &&
      relativeTo.getDate() < dateOfBirth.getDate());
  if (beforeBirthday) {
    age -= 1;
  }
  return Math.max(0, age);
}

const birthDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeZone: "UTC",
});

export function formatBirthDate(date: Date): string {
  return birthDateFormatter.format(date);
}