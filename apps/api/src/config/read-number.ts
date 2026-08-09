export const readNumber = (raw: unknown, fallback: number): number => {
  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : fallback;
};
