/*
  Warnings:

  - Added the required column `userId` to the `Cash` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BrokerageContributionStrategy" AS ENUM ('fixed', 'percentage_of_income', 'max');

-- CreateEnum
CREATE TYPE "DebtPaymentStrategy" AS ENUM ('MINIMUM_PAYMENT', 'FIXED_AMOUNT', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('Fixed', 'Variable');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('Monthly', 'Weekly', 'Quarterly', 'Annually', 'OneTime');

-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('Fixed', 'Variable');

-- CreateEnum
CREATE TYPE "IraType" AS ENUM ('taxExempt', 'taxDeferred');

-- CreateEnum
CREATE TYPE "IraContributionStrategy" AS ENUM ('fixed', 'percentage_of_income', 'max');

-- CreateEnum
CREATE TYPE "RetirementStrategy" AS ENUM ('FIRE', 'TRADITIONAL', 'COAST');

-- CreateEnum
CREATE TYPE "IncomeTaxStrategy" AS ENUM ('simple');

-- CreateEnum
CREATE TYPE "EmployerContributionStrategy" AS ENUM ('none', 'percentage_of_contribution', 'percentage_of_compensation', 'fixed');

-- CreateEnum
CREATE TYPE "TaxDeferredContributionStrategy" AS ENUM ('none', 'until_company_match', 'percentage_of_income', 'fixed', 'max');

-- CreateEnum
CREATE TYPE "AllowNegativeDisposableIncome" AS ENUM ('none', 'minimum_only', 'full');

-- AlterTable
ALTER TABLE "Cash" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "BrokerageInvestment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "growthRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "initialBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "contributionStrategy" "BrokerageContributionStrategy" NOT NULL,
    "contributionPercentage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "contributionFixedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "planId" INTEGER,

    CONSTRAINT "BrokerageInvestment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrokerageInvestmentTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "growthRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "initialBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "contributionStrategy" "BrokerageContributionStrategy" NOT NULL,
    "contributionPercentage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "contributionFixedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "planTemplateId" INTEGER,

    CONSTRAINT "BrokerageInvestmentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "initialAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "cashMaintenanceStrategy" "CashMaintenanceStrategy" NOT NULL,
    "reserveAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "reserveMonths" INTEGER NOT NULL,

    CONSTRAINT "CashTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Debt" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "principal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "interestRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "paymentMinimum" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "paymentStrategy" "DebtPaymentStrategy" NOT NULL,
    "paymentFixedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "paymentPercentage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Debt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebtTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "principal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "interestRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "paymentMinimum" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "paymentStrategy" "DebtPaymentStrategy" NOT NULL,
    "paymentFixedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "paymentPercentage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "planTemplateId" INTEGER,

    CONSTRAINT "DebtTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "type" "ExpenseType" NOT NULL,
    "frequency" "Frequency" NOT NULL,
    "isEssential" BOOLEAN NOT NULL DEFAULT false,
    "isTaxDeductible" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "type" "ExpenseType" NOT NULL,
    "frequency" "Frequency" NOT NULL,
    "isEssential" BOOLEAN NOT NULL DEFAULT false,
    "isTaxDeductible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ExpenseTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "grossIncome" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "growthRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "incomeType" "IncomeType" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomeTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "grossIncome" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "growthRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "incomeType" "IncomeType" NOT NULL,

    CONSTRAINT "IncomeTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IraInvestment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iraType" "IraType" NOT NULL,
    "growthRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "initialBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "contributionStrategy" "IraContributionStrategy" NOT NULL,
    "contributionPercentage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "contributionFixedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "IraInvestment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IraInvestmentTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iraType" "IraType" NOT NULL,
    "growthRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "initialBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "contributionStrategy" "IraContributionStrategy" NOT NULL,
    "contributionPercentage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "contributionFixedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "IraInvestmentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Retirement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lifeExpectancy" INTEGER NOT NULL,
    "retirementStrategy" "RetirementStrategy" NOT NULL,
    "retirementWithdrawalRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "retirementIncomeGoal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "retirementAge" INTEGER NOT NULL,
    "retirementSavingsAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Retirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetirementTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lifeExpectancy" INTEGER NOT NULL,
    "retirementStrategy" "RetirementStrategy" NOT NULL,
    "retirementWithdrawalRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "retirementIncomeGoal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "retirementAge" INTEGER NOT NULL,
    "retirementSavingsAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "RetirementTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tax" (
    "id" SERIAL NOT NULL,
    "taxStrategy" "IncomeTaxStrategy" NOT NULL,
    "taxRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxTemplate" (
    "id" SERIAL NOT NULL,
    "taxStrategy" "IncomeTaxStrategy" NOT NULL,
    "taxRate" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "TaxTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxDeferredInvestment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "growthRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "initialBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "electiveContributionStrategy" "TaxDeferredContributionStrategy" NOT NULL,
    "electiveContributionPercentage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "electiveContributionFixedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "employerContributes" BOOLEAN NOT NULL DEFAULT false,
    "employerContributionStrategy" "EmployerContributionStrategy" NOT NULL,
    "employerCompensationMatchPercentage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "employerContributionFixedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "employerMatchPercentage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "employerMatchPercentageLimit" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TaxDeferredInvestment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxDeferredInvestmentTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "growthRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "initialBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "electiveContributionStrategy" "TaxDeferredContributionStrategy" NOT NULL,
    "electiveContributionPercentage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "electiveContributionFixedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "employerContributes" BOOLEAN NOT NULL DEFAULT false,
    "employerContributionStrategy" "EmployerContributionStrategy" NOT NULL,
    "employerCompensationMatchPercentage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "employerContributionFixedAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "employerMatchPercentage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "employerMatchPercentageLimit" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "TaxDeferredInvestmentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "inflationRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "allowNegativeDisposableIncome" "AllowNegativeDisposableIncome" NOT NULL,
    "cashId" INTEGER,
    "retirementId" INTEGER,
    "taxId" INTEGER,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "inflationRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "allowNegativeDisposableIncome" "AllowNegativeDisposableIncome" NOT NULL,
    "retirementId" INTEGER NOT NULL,
    "cashId" INTEGER NOT NULL,
    "taxId" INTEGER NOT NULL,

    CONSTRAINT "PlanTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BrokerageInvestmentToPlan" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BrokerageInvestmentToPlan_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BrokerageInvestmentTemplateToPlanTemplate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BrokerageInvestmentTemplateToPlanTemplate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DebtToPlan" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DebtToPlan_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DebtTemplateToPlanTemplate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DebtTemplateToPlanTemplate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ExpenseToPlan" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ExpenseToPlan_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ExpenseTemplateToPlanTemplate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ExpenseTemplateToPlanTemplate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_IncomeToPlan" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_IncomeToPlan_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_IncomeTemplateToPlanTemplate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_IncomeTemplateToPlanTemplate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_IraInvestmentToPlan" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_IraInvestmentToPlan_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_IraInvestmentTemplateToPlanTemplate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_IraInvestmentTemplateToPlanTemplate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PlanToTaxDeferredInvestment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlanToTaxDeferredInvestment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PlanTemplateToTaxDeferredInvestmentTemplate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlanTemplateToTaxDeferredInvestmentTemplate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BrokerageInvestmentToPlan_B_index" ON "_BrokerageInvestmentToPlan"("B");

-- CreateIndex
CREATE INDEX "_BrokerageInvestmentTemplateToPlanTemplate_B_index" ON "_BrokerageInvestmentTemplateToPlanTemplate"("B");

-- CreateIndex
CREATE INDEX "_DebtToPlan_B_index" ON "_DebtToPlan"("B");

-- CreateIndex
CREATE INDEX "_DebtTemplateToPlanTemplate_B_index" ON "_DebtTemplateToPlanTemplate"("B");

-- CreateIndex
CREATE INDEX "_ExpenseToPlan_B_index" ON "_ExpenseToPlan"("B");

-- CreateIndex
CREATE INDEX "_ExpenseTemplateToPlanTemplate_B_index" ON "_ExpenseTemplateToPlanTemplate"("B");

-- CreateIndex
CREATE INDEX "_IncomeToPlan_B_index" ON "_IncomeToPlan"("B");

-- CreateIndex
CREATE INDEX "_IncomeTemplateToPlanTemplate_B_index" ON "_IncomeTemplateToPlanTemplate"("B");

-- CreateIndex
CREATE INDEX "_IraInvestmentToPlan_B_index" ON "_IraInvestmentToPlan"("B");

-- CreateIndex
CREATE INDEX "_IraInvestmentTemplateToPlanTemplate_B_index" ON "_IraInvestmentTemplateToPlanTemplate"("B");

-- CreateIndex
CREATE INDEX "_PlanToTaxDeferredInvestment_B_index" ON "_PlanToTaxDeferredInvestment"("B");

-- CreateIndex
CREATE INDEX "_PlanTemplateToTaxDeferredInvestmentTemplate_B_index" ON "_PlanTemplateToTaxDeferredInvestmentTemplate"("B");

-- AddForeignKey
ALTER TABLE "BrokerageInvestment" ADD CONSTRAINT "BrokerageInvestment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cash" ADD CONSTRAINT "Cash_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IraInvestment" ADD CONSTRAINT "IraInvestment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retirement" ADD CONSTRAINT "Retirement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tax" ADD CONSTRAINT "Tax_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxDeferredInvestment" ADD CONSTRAINT "TaxDeferredInvestment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_cashId_fkey" FOREIGN KEY ("cashId") REFERENCES "Cash"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_retirementId_fkey" FOREIGN KEY ("retirementId") REFERENCES "Retirement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "Tax"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanTemplate" ADD CONSTRAINT "PlanTemplate_retirementId_fkey" FOREIGN KEY ("retirementId") REFERENCES "RetirementTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanTemplate" ADD CONSTRAINT "PlanTemplate_cashId_fkey" FOREIGN KEY ("cashId") REFERENCES "CashTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanTemplate" ADD CONSTRAINT "PlanTemplate_taxId_fkey" FOREIGN KEY ("taxId") REFERENCES "TaxTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrokerageInvestmentToPlan" ADD CONSTRAINT "_BrokerageInvestmentToPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "BrokerageInvestment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrokerageInvestmentToPlan" ADD CONSTRAINT "_BrokerageInvestmentToPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrokerageInvestmentTemplateToPlanTemplate" ADD CONSTRAINT "_BrokerageInvestmentTemplateToPlanTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "BrokerageInvestmentTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrokerageInvestmentTemplateToPlanTemplate" ADD CONSTRAINT "_BrokerageInvestmentTemplateToPlanTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "PlanTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DebtToPlan" ADD CONSTRAINT "_DebtToPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "Debt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DebtToPlan" ADD CONSTRAINT "_DebtToPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DebtTemplateToPlanTemplate" ADD CONSTRAINT "_DebtTemplateToPlanTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "DebtTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DebtTemplateToPlanTemplate" ADD CONSTRAINT "_DebtTemplateToPlanTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "PlanTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpenseToPlan" ADD CONSTRAINT "_ExpenseToPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpenseToPlan" ADD CONSTRAINT "_ExpenseToPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpenseTemplateToPlanTemplate" ADD CONSTRAINT "_ExpenseTemplateToPlanTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "ExpenseTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpenseTemplateToPlanTemplate" ADD CONSTRAINT "_ExpenseTemplateToPlanTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "PlanTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncomeToPlan" ADD CONSTRAINT "_IncomeToPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "Income"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncomeToPlan" ADD CONSTRAINT "_IncomeToPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncomeTemplateToPlanTemplate" ADD CONSTRAINT "_IncomeTemplateToPlanTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "IncomeTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncomeTemplateToPlanTemplate" ADD CONSTRAINT "_IncomeTemplateToPlanTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "PlanTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IraInvestmentToPlan" ADD CONSTRAINT "_IraInvestmentToPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "IraInvestment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IraInvestmentToPlan" ADD CONSTRAINT "_IraInvestmentToPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IraInvestmentTemplateToPlanTemplate" ADD CONSTRAINT "_IraInvestmentTemplateToPlanTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "IraInvestmentTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IraInvestmentTemplateToPlanTemplate" ADD CONSTRAINT "_IraInvestmentTemplateToPlanTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "PlanTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlanToTaxDeferredInvestment" ADD CONSTRAINT "_PlanToTaxDeferredInvestment_A_fkey" FOREIGN KEY ("A") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlanToTaxDeferredInvestment" ADD CONSTRAINT "_PlanToTaxDeferredInvestment_B_fkey" FOREIGN KEY ("B") REFERENCES "TaxDeferredInvestment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlanTemplateToTaxDeferredInvestmentTemplate" ADD CONSTRAINT "_PlanTemplateToTaxDeferredInvestmentTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "PlanTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlanTemplateToTaxDeferredInvestmentTemplate" ADD CONSTRAINT "_PlanTemplateToTaxDeferredInvestmentTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "TaxDeferredInvestmentTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
