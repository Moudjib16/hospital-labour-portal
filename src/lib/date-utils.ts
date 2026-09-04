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
});

export function formatBirthDate(date: Date): string {
  return birthDateFormatter.format(date);
}