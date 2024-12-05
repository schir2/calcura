import { describe, it, expect, vi, beforeEach } from 'vitest';
import type DebtConfig from "~/models/debt/DebtConfig";
import {debtService} from "~/server/service/debtService";

vi.mock('@prisma/client', () => {
    const mockPrisma = {
        debt: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    };
    return { PrismaClient: vi.fn(() => mockPrisma) };
});

const mockPrisma = new (vi.mocked(require('@prisma/client').PrismaClient))();


describe('DebtService', () => {
    let mockDebtConfig: DebtConfig;

    beforeEach(() => {
        mockDebtConfig = {
            id: 1,
            name: 'Credit Card',
            principal: 5000,
            interestRate: 0.18,
            paymentMinimum: 100,
            paymentStrategy: 'fixed',
            paymentFixedAmount: 0,
            paymentPercentage: 0,
        };

        vi.clearAllMocks(); // Clear mock state before each test
    });

    it('should fetch all debts', async () => {
        mockPrisma.debt.findMany.mockResolvedValue([mockDebtConfig]);

        const result = await debtService.findMany();
        expect(result).toEqual([mockDebtConfig]);
        expect(mockPrisma.debt.findMany).toHaveBeenCalledOnce();
    });

    it('should fetch a single debt by ID', async () => {
        mockPrisma.debt.findUnique.mockResolvedValue(mockDebtConfig);

        const result = await debtService.findUnique(1);
        expect(result).toEqual(mockDebtConfig);
        expect(mockPrisma.debt.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should create a new debt', async () => {
        mockPrisma.debt.create.mockResolvedValue(mockDebtConfig);

        const newDebt = { ...mockDebtConfig, id: undefined }; // Remove ID for creation
        const result = await debtService.create(newDebt as Omit<DebtConfig, 'id'>);

        expect(result).toEqual(mockDebtConfig);
        expect(mockPrisma.debt.create).toHaveBeenCalledWith({ data: newDebt });
    });

    it('should update a debt', async () => {
        const updatedDebt = { ...mockDebtConfig, principal: 4500 };
        mockPrisma.debt.update.mockResolvedValue(updatedDebt);

        const result = await debtService.update(1, { principal: 4500 });

        expect(result).toEqual(updatedDebt);
        expect(mockPrisma.debt.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { principal: 4500 },
        });
    });

    it('should delete a debt', async () => {
        mockPrisma.debt.delete.mockResolvedValue(mockDebtConfig);

        const result = await debtService.delete(1);
        expect(result).toEqual(mockDebtConfig);
        expect(mockPrisma.debt.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
});