import type Command from "~/models/common/Command";
import {ExpenseManager} from "~/models/expense/ExpenseManager";

export class ProcessExpenseCommand implements Command {
    private expenseManager: ExpenseManager;

    constructor(expenseManager: ExpenseManager) {
        this.expenseManager = expenseManager;
    }

    execute(): void {
        return this.expenseManager.process();
    }

    getName(): string {
        return `Process Expense: ${this.expenseManager.getConfig().name}`;
    }
}
