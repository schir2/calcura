import { createBaseService } from './baseService'
import type DebtConfig from "~/models/debt/DebtConfig";

export const debtService = createBaseService<DebtConfig>('http://localhost:8000/debt-configs/')
