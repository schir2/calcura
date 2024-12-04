-- CreateEnum
CREATE TYPE "CashMaintenanceStrategy" AS ENUM ('fixedCashReserve', 'variableCashReserve');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cash" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "initialAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cashMaintenanceStrategy" "CashMaintenanceStrategy" NOT NULL,
    "reserveAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "reserveMonths" INTEGER NOT NULL,

    CONSTRAINT "Cash_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
