-- CreateTable
CREATE TABLE "Tournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tournamentDate" DATETIME NOT NULL,
    "t3Id" TEXT NOT NULL,
    "signupDisabled" BOOLEAN NOT NULL,
    "location" TEXT NOT NULL,
    "seats" TEXT NOT NULL
);
