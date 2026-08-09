type ClassNameValue = string | false | null | undefined;

export const classNames = (...values: ClassNameValue[]): string =>
  values.filter((value): value is string => Boolean(value)).join(' ');
