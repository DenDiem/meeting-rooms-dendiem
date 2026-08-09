-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "seriesId" UUID;

-- CreateTable
CREATE TABLE "BookingSeries" (
    "id" UUID NOT NULL,
    "roomId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingSeries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingSeries_userId_idx" ON "BookingSeries"("userId");

-- CreateIndex
CREATE INDEX "Booking_seriesId_idx" ON "Booking"("seriesId");

-- AddForeignKey
ALTER TABLE "BookingSeries" ADD CONSTRAINT "BookingSeries_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSeries" ADD CONSTRAINT "BookingSeries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "BookingSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
