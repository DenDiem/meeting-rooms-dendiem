const MILLISECONDS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;

export const durationInMinutes = (start: Date, end: Date): number =>
  (end.getTime() - start.getTime()) / MILLISECONDS_PER_MINUTE;

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const rest = minutes % MINUTES_PER_HOUR;
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(hours === 1 ? '1 hour' : `${hours} hours`);
  }

  if (rest > 0) {
    parts.push(`${rest} minutes`);
  }

  return parts.join(' ');
};
