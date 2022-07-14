/*
  Warnings:

  - A unique constraint covering the columns `[t3Id]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tournament_t3Id_key" ON "Tournament"("t3Id");
