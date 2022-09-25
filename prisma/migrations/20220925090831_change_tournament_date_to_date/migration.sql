/*
  Warnings:

  - You are about to alter the column `tournamentDate` on the `Tournament` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tournamentDate" DATETIME NOT NULL,
    "t3Id" TEXT NOT NULL,
    "signupDisabled" BOOLEAN NOT NULL,
    "location" TEXT NOT NULL,
    "seats" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Tournament" ("createdAt", "id", "location", "name", "seats", "signupDisabled", "t3Id", "tournamentDate", "updatedAt") SELECT "createdAt", "id", "location", "name", "seats", "signupDisabled", "t3Id", "tournamentDate", "updatedAt" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
CREATE UNIQUE INDEX "Tournament_t3Id_key" ON "Tournament"("t3Id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
