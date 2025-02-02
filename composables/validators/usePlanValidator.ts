import type {FormItemRule, FormRules} from "naive-ui";
import {type Plan, RetirementStrategy} from '~/models/plan/Plan'

export function usePlanValidator(modelRef: Ref<Partial<Plan>>) {
    function validateRetirementAge(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.retirementStrategy === RetirementStrategy.Age) {
            if (value === null || value === undefined) {
                return new Error("Retirement age is required when Age Retirement strategy is selected");
            }
        }
        return true;
    }

    function validateTargetSavingsAmount(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.retirementStrategy === RetirementStrategy.TargetSavings) {
            if (value === null || value === undefined) {
                return new Error("Target Savings Amount is required when Target Savings Retirement strategy is selected");
            }
        }
        return true;
    }

    function validateWithdrawalRate(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.retirementStrategy === RetirementStrategy.PercentRule) {
            if (value === null || value === undefined) {
                return new Error("Withdrawal Rate is required when Percent Rule Retirement strategy is selected");
            }
        }
        return true;
    }

    function validateRetirementIncomeGoal(rule: FormItemRule, value: number | undefined) {
        if (modelRef.value.retirementStrategy === RetirementStrategy.PercentRule) {
            if (value === null || value === undefined) {
                return new Error("Retirement Income Goal is required when Percent Rule Retirement strategy is selected");
            }
        }
        return true;
    }

    const rules: FormRules = {
        name: [
            {required: true, message: "Name is required", trigger: ["blur", "change"]},
            {
                min: MIN_NAME_LENGTH,
                message: `Name must be at least ${MIN_NAME_LENGTH} characters long.`,
                trigger: ["blur", "change"]
            },
            {
                max: MAX_NAME_LENGTH,
                message: `Name must be at most ${MAX_NAME_LENGTH} characters long.`,
                trigger: ["blur", "change"]
            }
        ],
        age: [
            {required: true, type: "number", message: "Age is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_AGE, message: `Age must be at least ${MIN_AGE}`, trigger: ["blur", "change"]},
            {type: "number", max: MAX_AGE, message: `Age must be at most ${MAX_AGE}`, trigger: ["blur", "change"]}
        ],
        inflationRate: [
            {required: true, type: "number", message: "Inflation rate is required", trigger: ["blur", "change"]}
        ],
        insufficientFundsStrategy: [
            {required: true, message: "Insufficient funds strategy is required", trigger: ["blur", "change"]}
        ],
        growthRate: [
            {required: true, type: "number", message: "Growth rate is required", trigger: ["blur", "change"]}
        ],
        growthApplicationStrategy: [
            {required: true, message: "Growth application strategy is required", trigger: ["blur", "change"]}
        ],
        year: [
            {required: true, type: "number", message: "Year is required", trigger: ["blur", "change"]},
            {type: "number", min: 2000, message: "Year must be at least 2000", trigger: ["blur", "change"]}
        ],
        lifeExpectancy: [
            {required: true, type: "number", message: "Life expectancy is required", trigger: ["blur", "change"]},
            {
                type: "number",
                min: MIN_RETIREMENT_LIFE_EXPECTANCY,
                message: `Life expectancy must be at least ${MIN_RETIREMENT_LIFE_EXPECTANCY}.`,
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: MAX_RETIREMENT_LIFE_EXPECTANCY,
                message: `Life expectancy must be at most ${MAX_RETIREMENT_LIFE_EXPECTANCY}.`,
                trigger: ["blur", "change"]
            }
        ],
        retirementStrategy: [
            {required: true, message: "Retirement strategy is required", trigger: ["blur", "change"]}
        ],
        retirementWithdrawalRate: [
            {validator: validateWithdrawalRate, message: "Withdrawal rate is required", trigger: ["blur", "change"]},
            {
                type: "number",
                min: MIN_RETIREMENT_WITHDRAWAL_RATE,
                message: `Withdrawal rate must be at least ${MIN_RETIREMENT_WITHDRAWAL_RATE}%.`,
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: MAX_RETIREMENT_WITHDRAWAL_RATE,
                message: `Withdrawal rate must be at most ${MAX_RETIREMENT_WITHDRAWAL_RATE}%.`,
                trigger: ["blur", "change"]
            }
        ],
        retirementIncomeGoal: [
            {
                validator: validateRetirementIncomeGoal,
                message: "Retirement income goal is required",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                min: MIN_RETIREMENT_INCOME_GOAL,
                message: `Income goal must be at least $${MIN_RETIREMENT_INCOME_GOAL}.`,
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: MAX_RETIREMENT_INCOME_GOAL,
                message: `Income goal must be at most $${MAX_RETIREMENT_INCOME_GOAL}.`,
                trigger: ["blur", "change"]
            }
        ],
        retirementAge: [
            {
                validator: validateRetirementAge,
                message: "Retirement age is required for Age Retirement Strategy",
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                min: MIN_RETIREMENT_AGE_FOR_WITHDRAWAL,
                message: `Retirement age must be at least ${MIN_RETIREMENT_AGE_FOR_WITHDRAWAL}.`,
                trigger: ["blur", "change"]
            },
            {
                type: "number",
                max: MAX_RETIREMENT_AGE_FOR_WITHDRAWAL,
                message: `Retirement age must be at most ${MAX_RETIREMENT_AGE_FOR_WITHDRAWAL}.`,
                trigger: ["blur", "change"]
            }
        ],
        retirementSavingsAmount: [
            {
                validator: validateTargetSavingsAmount,
                message: "Retirement savings amount is required for Target Retirement Savings Retirement Strategy",
                trigger: ["blur", "change"]
            },
            {type: "number", min: 0, message: "Retirement savings must be at least $0.", trigger: ["blur", "change"]},
            {
                type: "number",
                max: MAX_RETIREMENT_SAVINGS_AMOUNT,
                message: `Retirement savings must be at most $${MAX_RETIREMENT_SAVINGS_AMOUNT}.`,
                trigger: ["blur", "change"]
            }
        ],
        retirementIncomeAdjustedForInflation: [
            {
                type: "boolean",
                message: "Please select if income should be adjusted for inflation",
                trigger: ["blur", "change"]
            }
        ],
        taxStrategy: [
            {required: true, message: "Tax strategy is required", trigger: ["blur", "change"]}
        ],
        taxRate: [
            {required: true, type: "number", message: "Tax rate is required", trigger: ["blur", "change"]},
            {type: "number", min: MIN_TAX_RATE, message: "Tax rate cannot be negative.", trigger: ["blur", "change"]},
            {type: "number", max: MAX_TAX_RATE, message: "Tax rate must be 100% or less.", trigger: ["blur", "change"]}
        ]
    };

    return {rules};
}
