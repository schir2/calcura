import {BaseService} from "~/server/service/baseService";
import IncomeConfig from "~/models/income/IncomeConfig";

export const IncomeService = new BaseService<IncomeConfig>(prisma.income);