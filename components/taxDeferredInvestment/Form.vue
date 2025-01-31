<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Tax Deferred Investment: {{ modelRef.name }}</h3>
    </template>

    <template #default>
      <n-form ref="formRef" :model="modelRef" :rules="rules" class="space-y-3">
        <n-collapse>
          <n-collapse-item>
            <template #arrow>
              <Icon class="text-xl" name="mdi:info-circle"/>
            </template>
            <template #header>
              <span class="text-skin-primary">Learn More</span>
            </template>
            <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <n-card size="small" class="bg-skin-success/5">
                <template #header>
                  <h4 class="text-lg font-semibold text-skin-success">
                    <Icon name="mdi-thumbs-up"/>
                    Pros
                  </h4>
                </template>
                <ul class="list-disc list-inside">
                  <li>Tax-Deferred Growth: Contributions are made pre-tax, lowering your taxable income, and your
                  investments grow tax-deferred until withdrawal.
                  </li>
                  <li>Employer Matching: Many employers offer matching contributions, effectively adding to your savings
                  at no additional cost.
                  </li>
                  <li>High Contribution Limits: Annual limits are significantly higher than IRAs, allowing you to save
                  more.
                  </li>
                </ul>
              </n-card>
              <n-card size="small" class="bg-skin-error/5">
                <template #header>
                  <h4 class="text-lg font-semibold text-skin-error">
                    <Icon name="mdi:thumbs-down"/>
                    Cons
                  </h4>
                </template>
                <ul class="list-disc list-inside">
                  <li>Withdrawals Are Taxable: Distributions in retirement are taxed as ordinary income, which could
                  impact your tax bracket.
                  </li>
                  <li>Early Withdrawal Penalty: Withdrawals before age 59½ incur a 10% penalty plus taxes, with limited
                  exceptions.
                  </li>
                  <li>RMDs Apply: Required Minimum Distributions must begin at age 73, forcing you to withdraw a portion
                  of your savings even if you don’t need it.
                  </li>
                </ul>
              </n-card>
              <n-card size="small" class="bg-skin-warning/5">
                <template #header>
                  <h4 class="text-lg font-semibold text-skin-warning">
                    <icon name="mdi:warning"/>
                    Things to Note
                  </h4>
                </template>
                <ul class="list-disc list-inside">
                  <li>Contribution Limits: The 2025 limit is $22,500, with an additional $7,500 catch-up contribution for
                  those aged 50+.
                  </li>
                  <li>Investment Options: Limited to the funds offered by your plan provider, which may not offer the same
                  flexibility as an IRA.
                  </li>
                  <li>Portability: Accounts can typically be rolled over into an IRA or a new employer’s plan when you
                  change jobs.
                  </li>
                  <li>Loan Availability: Some plans allow you to borrow against your account balance, but doing so can
                  reduce long-term growth.
                  </li>
                </ul>
              </n-card>
            </section>
          </n-collapse-item>
        </n-collapse>
        <section class="grid grid-cols-3 gap-3">
          <n-form-item path="name" :label="taxDeferredInvestmentForm.name.label">
            <n-input v-model:value="modelRef.name"/>
          </n-form-item>
          <n-form-item path="initialBalance" :label="taxDeferredInvestmentForm.initialBalance.label"
          >
            <n-input-number class="w-full" v-model:value="modelRef.initialBalance"/>
          </n-form-item>
          <n-form-item path="growthRate" :label="taxDeferredInvestmentForm.growthRate.label">
            <n-input-number class="w-full" v-model:value="modelRef.growthRate"/>
          </n-form-item>
        </section>

        <IncomeSelector :incomes="incomes" v-model="modelRef.income"/>

        <n-form-item path="electiveContributionStrategy"
                     :label="taxDeferredInvestmentForm.electiveContributionStrategy.label"
        >
          <div class="grid grid-cols-4 gap-3">
            <CommonRadioCard v-model="modelRef.electiveContributionStrategy" :value="TaxDeferredContributionStrategy.Fixed"
                             title="Fixed Payment">
              <n-form-item path="contributionFixedAmount"
                           :label="taxDeferredInvestmentForm.electiveContributionFixedAmount.label"
              >
                <n-input-number class="w-full" v-model:value="modelRef.electiveContributionFixedAmount" :precision="2" :min="0"
                                :max="getTaxDeferredElectiveContributionLimit(new Date().getFullYear(), 30)">
                  <template #prefix>$</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <n-collapse>
                <n-collapse-item>
                  <template #arrow>
                    <Icon class="text-xl" name="mdi:info-circle"/>
                  </template>
                  <template #header>
                    <span class="text-skin-primary">Learn More</span>
                  </template>
                  <section class="p-3">
                    <h3 class="text-lg font-semibold">What it means:</h3>
                    <p>
                      You contribute a set dollar amount to your tax-deferred account each year.
                    </p>

                    <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                    <p class="mt-1">
                      Enter a specific annual contribution amount that remains consistent, regardless of changes in your
                      income or employer match.
                    </p>
                  </section>
                </n-collapse-item>
              </n-collapse>
            </CommonRadioCard>
            <CommonRadioCard v-model="modelRef.electiveContributionStrategy"
                             :value="TaxDeferredContributionStrategy.PercentageOfIncome" title="Percentage of Income">
              <n-form-item path="contributionPercentage"
                           :label="taxDeferredInvestmentForm.electiveContributionPercentage.label"
              >
                <n-input-number class="w-full" v-model:value="modelRef.electiveContributionPercentage" :precision="2">
                  <template #prefix>%</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <n-collapse>
                <n-collapse-item>
                  <template #arrow>
                    <Icon class="text-xl" name="mdi:info-circle"/>
                  </template>
                  <template #header>
                    <span class="text-skin-primary">Learn More</span>
                  </template>
                  <section class="p-3">
                    <h3 class="text-lg font-semibold">What it means:</h3>
                    <p>
                      Your contributions are calculated as a percentage of your income, adjusting as your earnings change.
                    </p>

                    <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                    <p class="mt-1">
                      Specify a percentage (e.g., 10%) of your income to contribute. The exact dollar amount contributed
                      each year will vary based on your income.
                    </p>
                  </section>
                </n-collapse-item>
              </n-collapse>
            </CommonRadioCard>
            <CommonRadioCard v-model="modelRef.electiveContributionStrategy"
                             :value="TaxDeferredContributionStrategy.UntilCompanyMatch" title="Employer Match Max">
              <n-collapse>
                <n-collapse-item>
                  <template #arrow>
                    <Icon class="text-xl" name="mdi:info-circle"/>
                  </template>
                  <template #header>
                    <span class="text-skin-primary">Learn More</span>
                  </template>
                  <section class="p-3">
                    <h3 class="text-lg font-semibold">What it means:</h3>
                    <p>
                      You contribute only enough to take full advantage of your employer’s matching contributions.
                    </p>

                    <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                    <p class="mt-1">
                      Set contributions to align with your employer’s matching policy, typically based on a percentage of
                      your income (e.g., "100% of the first 3% of salary").
                    </p>
                  </section>
                </n-collapse-item>
              </n-collapse>
            </CommonRadioCard>
            <CommonRadioCard v-model="modelRef.electiveContributionStrategy" :value="TaxDeferredContributionStrategy.Max"
                             title="Maximum">
              <n-collapse>
                <n-collapse-item>
                  <template #arrow>
                    <Icon class="text-xl" name="mdi:info-circle"/>
                  </template>
                  <template #header>
                    <span class="text-skin-primary">Learn More</span>
                  </template>
                  <section class="p-3">
                    <h3 class="text-lg font-semibold">What it means:</h3>
                    <p>
                      You aim to contribute the maximum amount allowed by the IRS every year.
                    </p>

                    <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                    <p class="mt-1">
                      Automatically sets your contributions to meet the IRS annual limit (e.g., $22,500, or $30,000 if aged
                      50+ in 2025).
                    </p>
                  </section>
                </n-collapse-item>
              </n-collapse>
            </CommonRadioCard>
          </div>
        </n-form-item>

        <n-form-item path="employerContributionStrategy"
                     :label="taxDeferredInvestmentForm.employerContributionStrategy.label"
        >
          <div class="grid grid-cols-3 gap-3">
            <CommonRadioCard v-model="modelRef.employerContributionStrategy" :value="EmployerContributionStrategy.Fixed"
                             title="Fixed Payment">
              <n-form-item path="contributionFixedAmount"
                           :label="taxDeferredInvestmentForm.employerContributionFixedAmount.label"
              >
                <n-input-number class="w-full" v-model:value="modelRef.employerContributionFixedAmount" :precision="2" :min="0"
                                :max="8000">
                  <template #prefix>$</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <n-collapse>
                <n-collapse-item>
                  <template #arrow>
                    <Icon class="text-xl" name="mdi:info-circle"/>
                  </template>
                  <template #header>
                    <span class="text-skin-primary">Learn More</span>
                  </template>
                  <section class="p-3">
                    <h3 class="text-lg font-semibold">What it means:</h3>
                    <p>
                      The employer contributes a set dollar amount to the employee’s account every year.
                    </p>

                    <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                    <p class="mt-1">
                      A specific annual amount is predefined by the employer and added to the employee’s tax-deferred
                      account, regardless of the employee's salary or contributions.
                    </p>
                  </section>
                </n-collapse-item>
              </n-collapse>
            </CommonRadioCard>
            <CommonRadioCard v-model="modelRef.employerContributionStrategy"
                             :value="EmployerContributionStrategy.PercentageOfContribution"
                             title="Percentage of Contribution">
              <p class="grid grid-cols-2 gap-3">
                <n-form-item path="employerMatchPercentage"
                             :label="taxDeferredInvestmentForm.employerMatchPercentage.label"
                >
                  <n-input-number v-model:value="modelRef.employerMatchPercentage"/>
                </n-form-item>
                <n-form-item path="employerMatchPercentageLimit"
                             :label="taxDeferredInvestmentForm.employerMatchPercentageLimit.label"
                >
                  <n-input-number v-model:value="modelRef.employerMatchPercentageLimit"/>
                </n-form-item>
              </p>
              <n-collapse>
                <n-collapse-item>
                  <template #arrow>
                    <Icon class="text-xl" name="mdi:info-circle"/>
                  </template>
                  <template #header>
                    <span class="text-skin-primary">Learn More</span>
                  </template>
                  <section class="p-3">
                    <h3 class="text-lg font-semibold">What it means:</h3>
                    <p>
                      The employer matches a percentage of the employee’s own contributions, up to a certain limit.
                    </p>

                    <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                    <p class="mt-1">
                      Specify a percentage (e.g., 10%) of your income to contribute. The exact dollar amount contributed
                      each year will vary based on your income.
                    </p>
                  </section>
                </n-collapse-item>
              </n-collapse>
            </CommonRadioCard>
            <CommonRadioCard v-model="modelRef.employerContributionStrategy"
                             :value="EmployerContributionStrategy.PercentageOfCompensation"
                             title="Percentage of Compensation">
              <n-form-item path="employerCompensationMatchPercentage"
                           :label="taxDeferredInvestmentForm.employerCompensationMatchPercentage.label"
              >
                <n-input-number v-model:value="modelRef.employerCompensationMatchPercentage"/>
              </n-form-item>
              <n-collapse>
                <n-collapse-item>
                  <template #arrow>
                    <Icon class="text-xl" name="mdi:info-circle"/>
                  </template>
                  <template #header>
                    <span class="text-skin-primary">Learn More</span>
                  </template>
                  >
                  <section class="p-3">
                    <h3 class="text-lg font-semibold">What it means:</h3>
                    <p>
                      You contribute only enough to take full advantage of your employer’s matching contributions.
                    </p>

                    <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                    <p class="mt-1">
                      Set contributions to align with your employer’s matching policy, typically based on a percentage of
                      your income (e.g., "100% of the first 3% of salary").
                    </p>
                  </section>
                </n-collapse-item>
              </n-collapse>
            </CommonRadioCard>
          </div>
        </n-form-item>

      </n-form>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import {taxDeferredInvestmentForm} from "~/forms/taxDeferredInvestmentForm";
import {EmployerContributionStrategy, TaxDeferredContributionStrategy, type TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import {getTaxDeferredElectiveContributionLimit} from "~/utils";
import type {Income} from "~/models/income/Income";
import type {FormInst, FormItemRule, FormRules} from "naive-ui";

interface Props {
  initialValues: Partial<TaxDeferredInvestment>;
  mode: 'create' | 'edit' | 'view';
  incomes: Income[] | undefined;
}

const props = defineProps<Props>();
const modelRef = ref(props.initialValues);
const formRef = ref<FormInst | null>(null);

const emit = defineEmits(["update", "cancel", "create"]);

function validateContributionFixedAmount(rule: FormItemRule, value: number | undefined) {
  if (modelRef.value.electiveContributionStrategy === "fixed" && (value === null || value === undefined)) {
    return new Error("Fixed contribution amount is required when Fixed Contribution strategy is selected");
  }
  return true;
}

function validateContributionPercentage(rule: FormItemRule, value: number | undefined) {
  if (modelRef.value.electiveContributionStrategy === "percentage_of_income" && (value === null || value === undefined)) {
    return new Error("Contribution Percentage is required when Percentage of Income Contribution strategy is selected");
  }
  return true;
}

const rules: FormRules = {
  name: [
    {required: true, message: "Name is required", trigger: ["blur", "change"]},
    {min: 3, message: "Investment name must be at least 3 characters long", trigger: ["blur", "change"]},
    {max: 32, message: "Investment name must be at most 32 characters long", trigger: ["blur", "change"]}
  ],
  growthRate: [
    {required: true, type: "number", message: "Growth rate is required", trigger: ["blur", "change"]},
    {type: "number", min: 0, message: "Growth rate must be at least 0", trigger: ["blur", "change"]},
    {type: "number", max: 100, message: "Growth rate must be at most 100", trigger: ["blur", "change"]}
  ],
  balance: [
    {required: true, type: "number", message: "Balance is required", trigger: ["blur", "change"]},
    {type: "number", min: 0, message: "Balance must be at least 0", trigger: ["blur", "change"]}
  ],
  electiveContributionStrategy: [
    {required: true, message: "Elective contribution strategy is required", trigger: ["blur", "change"]}
  ],
  electiveContributionPercentage: [
    {validator: validateContributionPercentage, trigger: ["blur", "change"]},
    {type: "number", min: 0, message: "Elective contribution percentage must be at least 0", trigger: ["blur", "change"]},
    {type: "number", max: 100, message: "Elective contribution percentage must be at most 100", trigger: ["blur", "change"]}
  ],
  electiveContributionAmount: [
    {validator: validateContributionFixedAmount, trigger: ["blur", "change"]},
    {type: "number", min: 0, message: "Elective contribution fixed amount must be at least 0", trigger: ["blur", "change"]}
  ],
  employerContributionStrategy: [
    {required: true, message: "Employer contribution strategy is required", trigger: ["blur", "change"]}
  ],
  employerCompensationMatchPercentage: [
    {required: true, type: "number", message: "Employer compensation match percentage is required", trigger: ["blur", "change"]},
    {type: "number", min: 0, message: "Employer compensation match percentage must be at least 0", trigger: ["blur", "change"]},
    {type: "number", max: 100, message: "Employer compensation match percentage must be at most 100", trigger: ["blur", "change"]}
  ],
  employerContributionFixedAmount: [
    {required: true, type: "number", message: "Employer contribution fixed amount is required", trigger: ["blur", "change"]},
    {type: "number", min: 0, message: "Employer contribution fixed amount must be at least 0", trigger: ["blur", "change"]}
  ],
  employerMatchPercentage: [
    {required: true, type: "number", message: "Employer match percentage is required", trigger: ["blur", "change"]},
    {type: "number", min: 0, message: "Employer match percentage must be at least 0", trigger: ["blur", "change"]},
    {type: "number", max: 100, message: "Employer match percentage must be at most 100", trigger: ["blur", "change"]}
  ],
  employerMatchPercentageLimit: [
    {required: true, type: "number", message: "Employer match percentage limit is required", trigger: ["blur", "change"]},
    {type: "number", min: 0, message: "Employer match percentage limit must be at least 0", trigger: ["blur", "change"]},
    {type: "number", max: 100, message: "Employer match percentage limit must be at most 100", trigger: ["blur", "change"]}
  ]
};

function handleCreate() {
  emit('create', modelRef.value)

}

function handleCancel() {
  emit('cancel')
}

function handleUpdate() {
  emit('update', modelRef.value)
}
</script>