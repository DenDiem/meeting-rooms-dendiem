-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailConfirmedAt" TIMESTAMPTZ(3);

UPDATE "User" SET "emailConfirmedAt" = CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "EmailConfirmation" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" CHAR(64) NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "usedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailConfirmation_tokenHash_key" ON "EmailConfirmation"("tokenHash");

-- CreateIndex
CREATE INDEX "EmailConfirmation_userId_idx" ON "EmailConfirmation"("userId");

-- AddForeignKey
ALTER TABLE "EmailConfirmation" ADD CONSTRAINT "EmailConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
