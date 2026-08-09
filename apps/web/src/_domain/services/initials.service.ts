const MAX_INITIALS = 2;

export const toInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, MAX_INITIALS)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
