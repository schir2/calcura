<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Tax Deferred Investment: {{ taxDeferredInvestmentPartial.name }}</h3>
    </template>

    <template #default>
      <n-form class="space-y-3">
        <n-card size="small" class="bg-skin-info/5">
          <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <n-card size="small" class="bg-skin-success/5">
              <template #header>
                <h4 class="text-lg font-semibold text-skin-success">
                  <Icon name="mdi-thumbs-up"/>
                  Pros
                </h4>
              </template>
              <ul class="list-disc list-inside">
                <li>Tax-Deferred Growth: Contributions are made pre-tax, lowering your taxable income, and your investments grow tax-deferred until withdrawal.</li>
                <li>Employer Matching: Many employers offer matching contributions, effectively adding to your savings at no additional cost.</li>
                <li>High Contribution Limits: Annual limits are significantly higher than IRAs, allowing you to save more.</li>
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
                <li>Withdrawals Are Taxable: Distributions in retirement are taxed as ordinary income, which could impact your tax bracket.</li>
                <li>Early Withdrawal Penalty: Withdrawals before age 59½ incur a 10% penalty plus taxes, with limited exceptions.</li>
                <li>RMDs Apply: Required Minimum Distributions must begin at age 73, forcing you to withdraw a portion of your savings even if you don’t need it.</li>
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
                <li>Contribution Limits: The 2025 limit is $22,500, with an additional $7,500 catch-up contribution for those aged 50+.</li>
                <li>Investment Options: Limited to the funds offered by your plan provider, which may not offer the same flexibility as an IRA.</li>
                <li>Portability: Accounts can typically be rolled over into an IRA or a new employer’s plan when you change jobs.</li>
                <li>Loan Availability: Some plans allow you to borrow against your account balance, but doing so can reduce long-term growth.</li>
              </ul>
            </n-card>
          </section>

        </n-card>

        <section class="grid grid-cols-3 gap-3">
          <n-form-item path="name" :label="taxDeferredInvestmentForm.name.label" v-bind="nameProps">
            <n-input v-model:value="name"/>
          </n-form-item>
          <n-form-item path="initialBalance" :label="taxDeferredInvestmentForm.initialBalance.label" v-bind="initialBalanceProps">
            <n-input-number class="w-full" v-model:value="initialBalance"/>
          </n-form-item>
          <n-form-item path="growthRate" :label="taxDeferredInvestmentForm.growthRate.label" v-bind="growthRateProps">
            <n-input-number class="w-full" v-model:value="growthRate"/>
          </n-form-item>
        </section>


        <n-form-item path="electiveContributionStrategy" :label="taxDeferredInvestmentForm.electiveContributionStrategy.label" v-bind="electiveContributionStrategyProps">
          <div class="grid grid-cols-4 gap-3">
            <CommonRadioCard v-model="electiveContributionStrategy" :value="TaxDeferredContributionStrategy.Fixed" title="Fixed Payment">
              <n-form-item path="contributionFixedAmount" :label="taxDeferredInvestmentForm.electiveContributionFixedAmount.label" v-bind="electiveContributionFixedAmountProps">
                <n-input-number class="w-full" v-model:value="electiveContributionFixedAmount" :precision="2" :min="0" :max="8000">
                  <template #prefix>$</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>
                  You contribute a set dollar amount to your tax-deferred account each year.
                </p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p class="mt-1">
                  Enter a specific annual contribution amount that remains consistent, regardless of changes in your income or employer match.
                </p>
              </section>
            </CommonRadioCard>
            <CommonRadioCard v-model="electiveContributionStrategy" :value="TaxDeferredContributionStrategy.PercentageOfIncome" title="Percentage of Income">
              <n-form-item path="contributionPercentage" :label="taxDeferredInvestmentForm.electiveContributionPercentage.label" v-bind="electiveContributionPercentageProps">
                <n-input-number class="w-full" v-model:value="electiveContributionPercentage" :precision="2">
                  <template #prefix>%</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>
                  Your contributions are calculated as a percentage of your income, adjusting as your earnings change.
                </p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p class="mt-1">
                  Specify a percentage (e.g., 10%) of your income to contribute. The exact dollar amount contributed each year will vary based on your income.
                </p>
              </section>
            </CommonRadioCard>
            <CommonRadioCard v-model="electiveContributionStrategy" :value="TaxDeferredContributionStrategy.UntilCompanyMatch" title="Employer Match Max">
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>
                  You contribute only enough to take full advantage of your employer’s matching contributions.
                </p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p class="mt-1">
                  Set contributions to align with your employer’s matching policy, typically based on a percentage of your income (e.g., "100% of the first 3% of salary").
                </p>
              </section>
            </CommonRadioCard>
            <CommonRadioCard v-model="electiveContributionStrategy" :value="TaxDeferredContributionStrategy.Max" title="Maximum">
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>
                  You aim to contribute the maximum amount allowed by the IRS every year.
                </p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p class="mt-1">
                  Automatically sets your contributions to meet the IRS annual limit (e.g., $22,500, or $30,000 if aged 50+ in 2025).
                </p>
              </section>
            </CommonRadioCard>
          </div>
        </n-form-item>

        <n-form-item path="employerContributionStrategy" :label="taxDeferredInvestmentForm.employerContributionStrategy.label" v-bind="employerContributionStrategyProps">
          <div class="grid grid-cols-3 gap-3">
            <CommonRadioCard v-model="employerContributionStrategy" :value="EmployerContributionStrategy.Fixed" title="Fixed Payment">
              <n-form-item path="contributionFixedAmount" :label="taxDeferredInvestmentForm.employerContributionFixedAmount.label" v-bind="employerContributionFixedAmountProps">
                <n-input-number class="w-full" v-model:value="employerContributionFixedAmount" :precision="2" :min="0" :max="8000">
                  <template #prefix>$</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>
                  The employer contributes a set dollar amount to the employee’s account every year.
                </p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p class="mt-1">
                  A specific annual amount is predefined by the employer and added to the employee’s tax-deferred account, regardless of the employee's salary or contributions.
                </p>
              </section>
            </CommonRadioCard>
            <CommonRadioCard v-model="employerContributionStrategy" :value="EmployerContributionStrategy.PercentageOfContribution" title="Percentage of Contribution">
              <p class="grid grid-cols-2 gap-3">
                <n-form-item path="employerMatchPercentage" :label="taxDeferredInvestmentForm.employerMatchPercentage.label" v-bind="employerMatchPercentageProps">
                  <n-input-number v-model:value="employerMatchPercentage"/>
                </n-form-item>
                <n-form-item path="employerMatchPercentageLimit" :label="taxDeferredInvestmentForm.employerMatchPercentageLimit.label" v-bind="employerMatchPercentageLimitProps">
                  <n-input-number v-model:value="employerMatchPercentageLimit"/>
                </n-form-item>
              </p>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>
                  The employer matches a percentage of the employee’s own contributions, up to a certain limit.
                </p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p class="mt-1">
                  Specify a percentage (e.g., 10%) of your income to contribute. The exact dollar amount contributed each year will vary based on your income.
                </p>
              </section>
            </CommonRadioCard>
            <CommonRadioCard v-model="employerContributionStrategy" :value="EmployerContributionStrategy.PercentageOfCompensation" title="Percentage of Compensation">
              <n-form-item path="employerCompensationMatchPercentage" :label="taxDeferredInvestmentForm.employerCompensationMatchPercentage.label" v-bind="employerCompensationMatchPercentageProps">
                <n-input-number v-model:value="employerCompensationMatchPercentage"/>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>
                  You contribute only enough to take full advantage of your employer’s matching contributions.
                </p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p class="mt-1">
                  Set contributions to align with your employer’s matching policy, typically based on a percentage of your income (e.g., "100% of the first 3% of salary").
                </p>
              </section>
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
import {taxDeferredInvestmentForm, taxDeferredInvestmentFormSchema} from "~/forms/taxDeferredInvestmentForm";
import {useForm} from "vee-validate";
import {EmployerContributionStrategy, TaxDeferredContributionStrategy, type TaxDeferredInvestment} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import {naiveConfig} from "~/utils/schemaUtils";

interface Props {
  taxDeferredInvestmentPartial: Partial<TaxDeferredInvestment>;
  mode: 'create' | 'edit' | 'view'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: taxDeferredInvestmentFormSchema,
  initialValues: props.taxDeferredInvestmentPartial,
});

const [name, nameProps] = defineField('name', naiveConfig);
const [income, incomeProps] = defineField('income', naiveConfig);
const [growthRate, growthRateProps] = defineField('growthRate', naiveConfig);
const [initialBalance, initialBalanceProps] = defineField('initialBalance', naiveConfig);
const [electiveContributionStrategy, electiveContributionStrategyProps] = defineField('electiveContributionStrategy', naiveConfig);
const [electiveContributionPercentage, electiveContributionPercentageProps] = defineField('electiveContributionPercentage', naiveConfig);
const [electiveContributionFixedAmount, electiveContributionFixedAmountProps] = defineField('electiveContributionFixedAmount', naiveConfig);
const [employerContributionStrategy, employerContributionStrategyProps] = defineField('employerContributionStrategy', naiveConfig);
const [employerCompensationMatchPercentage, employerCompensationMatchPercentageProps] = defineField('employerCompensationMatchPercentage', naiveConfig);
const [employerContributionFixedAmount, employerContributionFixedAmountProps] = defineField('employerContributionFixedAmount', naiveConfig);
const [employerMatchPercentage, employerMatchPercentageProps] = defineField('employerMatchPercentage', naiveConfig);
const [employerMatchPercentageLimit, employerMatchPercentageLimitProps] = defineField('employerMatchPercentageLimit', naiveConfig);

function handleCreate() {
  emit('create', values)

}

function handleCancel() {
  emit('cancel')
}

function handleUpdate() {
  emit('update', values)
}
</script>