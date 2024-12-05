import {BaseService} from "~/server/service/baseService";
import DebtConfig from "~/models/debt/DebtConfig";

export const debtService = new BaseService<DebtConfig>(prisma.income);