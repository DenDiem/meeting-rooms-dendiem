-- CreateTable
CREATE TABLE "Room" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "floor" SMALLINT NOT NULL,
    "capacity" SMALLINT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");
