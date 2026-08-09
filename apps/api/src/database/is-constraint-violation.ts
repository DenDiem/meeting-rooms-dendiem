import { Prisma } from '@generated/prisma/client';

const readDriverCause = (error: Prisma.PrismaClientKnownRequestError): unknown => {
  const driverAdapterError = error.meta?.['driverAdapterError'];

  return typeof driverAdapterError === 'object' &&
    driverAdapterError !== null &&
    'cause' in driverAdapterError
    ? driverAdapterError.cause
    : null;
};

export const isConstraintViolation = (
  error: unknown,
  postgresCode: string,
  constraintName: string,
): boolean => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }

  const cause = readDriverCause(error);

  if (typeof cause !== 'object' || cause === null) {
    return false;
  }

  return (
    'code' in cause &&
    cause.code === postgresCode &&
    'message' in cause &&
    typeof cause.message === 'string' &&
    cause.message.includes(constraintName)
  );
};
