export function formatRelativeTime(
  isoTimestamp: string,
  now: Date = new Date()
): string {
  const then = new Date(isoTimestamp).getTime();
  if (Number.isNaN(then)) {
    return "";
  }

  const diffMs = Math.max(0, now.getTime() - then);
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) {
    return "ahora";
  }
  if (minutes < 60) {
    return `hace ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `hace ${hours} h`;
  }

  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}
