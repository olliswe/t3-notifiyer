-- CreateTable
CREATE TABLE "Tournament" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tournamentDate" TIMESTAMP(3) NOT NULL,
    "t3Id" TEXT NOT NULL,
    "signupDisabled" BOOLEAN NOT NULL,
    "location" TEXT NOT NULL,
    "seats" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_t3Id_key" ON "Tournament"("t3Id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
