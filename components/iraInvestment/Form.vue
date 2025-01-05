<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Roth IRA Investment: {{ iraInvestmentPartial.name }}</h3>
    </template>

    <template #default>
      <n-form class="space-y-3">
        <n-card size="small" class="bg-skin-info/5">
          <template #header>
            <Icon name="mdi-info"/>
            Info
          </template>
          <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <n-card size="small" class="bg-skin-success/5">
              <template #header>
                <h4 class="text-lg font-semibold text-skin-success"><Icon name="mdi-thumbs-up"/> Pros</h4>
              </template>
              <ul class="list-disc list-inside">
                <li>Contributions may be tax-deductible, providing immediate tax savings.</li>
                <li>Earnings grow tax-deferred, meaning you won't pay taxes on gains until you withdraw.</li>
                <li>Available to anyone with earned income, regardless of employer retirement plans.</li>
              </ul>
            </n-card>
            <n-card size="small" class="bg-skin-error/5">
              <h4 class="text-lg font-semibold text-skin-error"><Icon name="mdi:thumbs-down"/> Cons</h4>
              <ul class="list-disc list-inside">
                <li>Withdrawals in retirement are taxed as ordinary income.</li>
                <li>Required Minimum Distributions (RMDs) must start at age 73.</li>
                <li>Early withdrawals (before age 59½) are subject to a 10% penalty plus taxes, with limited exceptions.</li>
              </ul>
            </n-card>
            <n-card size="small" class="bg-skin-warning/5">
              <h4 class="text-lg font-semibold text-skin-warning"><icon name="mdi:warning"/> Things to Note</h4>
              <ul class="list-disc list-inside">
                <li>Contribution limits are $7,000 ($8,000 if age 50+ for catch-up contributions).</li>
                <li>Deductibility of contributions depends on income and participation in an employer-sponsored plan.</li>
                <li>Ideal for those who anticipate being in a lower tax bracket in retirement.</li>
              </ul>
            </n-card>
          </section>

        </n-card>
        <section class="grid grid-cols-3 gap-3">
          <n-form-item path="name" :label="iraInvestmentForm.name.label" v-bind="nameProps">
            <n-input v-model:value="name"/>
          </n-form-item>
          <n-form-item path="initialBalance" :label="iraInvestmentForm.initialBalance.label" v-bind="initialBalanceProps">
            <n-input-number class="w-full" v-model:value="initialBalance"/>
          </n-form-item>
          <n-form-item path="growthRate" :label="iraInvestmentForm.growthRate.label" v-bind="growthRateProps">
            <n-input-number class="w-full" v-model:value="growthRate"/>
          </n-form-item>
        </section>
        <n-form-item path="contributionStrategy" :label="iraInvestmentForm.contributionStrategy.label" v-bind="contributionStrategyProps">
          <div class="grid grid-cols-3 gap-3">
            <CommonRadioCard v-model="contributionStrategy" :value="IraContributionStrategy.Fixed" title="Fixed Payment">
              <n-form-item path="contributionFixedAmount" :label="iraInvestmentForm.contributionFixedAmount.label" v-bind="contributionFixedAmountProps">
                <n-input-number class="w-full" v-model:value="contributionFixedAmount" :precision="2" :min="0" :max="8000">
                  <template #prefix>$</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>
                  You commit to contributing a set dollar amount to your Traditional IRA every year.
                </p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p class="mt-1">
                  Enter a specific annual amount you wish to invest, ensuring it stays within IRS limits.
                </p>
              </section>
            </CommonRadioCard>
            <CommonRadioCard v-model="contributionStrategy" :value="IraContributionStrategy.PercentageOfIncome" title="Percentage of Income">
              <n-form-item path="contributionPercentage" :label="iraInvestmentForm.contributionPercentage.label" v-bind="contributionPercentageProps">
                <n-input-number class="w-full" v-model:value="contributionPercentage" :precision="2">
                  <template #prefix>%</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>
                  Your contributions are based on a percentage of your income, automatically adjusting as your earnings change.
                </p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p class="mt-1">
                  Specify a percentage (e.g., 10%) of your income. The dollar amount contributed will vary annually based on your income.
                </p>
              </section>
            </CommonRadioCard>
            <CommonRadioCard v-model="contributionStrategy" :value="IraContributionStrategy.Max" title="Maximum">
              <section class="p-3">
                <!--                <n-input-number min="0" max="120" v-model:value="age"/>-->
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>
                  You aim to contribute the maximum allowed by the IRS every year.
                </p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p class="mt-1">
                  Automatically sets your annual contribution to the IRS maximum (e.g., $7,000 or $8,000 if you’re 50+).
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
import {iraInvestmentForm, iraInvestmentFormSchema} from "~/forms/iraInvestmentForm";
import {useForm} from "vee-validate";
import {IraContributionStrategy, type IraInvestment, type IraInvestmentPartial} from "~/models/iraInvestment/IraInvestment";
import {naiveConfig} from "~/utils/schemaUtils";

interface Props {
  iraInvestmentPartial: IraInvestment | IraInvestmentPartial;
  age?: number;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: iraInvestmentFormSchema,
  initialValues: props.iraInvestmentPartial,
});

const [name, nameProps] = defineField('name', naiveConfig);
const [growthRate, growthRateProps] = defineField('growthRate', naiveConfig);
const [initialBalance, initialBalanceProps] = defineField('initialBalance', naiveConfig);
const [contributionStrategy, contributionStrategyProps] = defineField('contributionStrategy', naiveConfig);
const [contributionPercentage, contributionPercentageProps] = defineField('contributionPercentage', naiveConfig);
const [contributionFixedAmount, contributionFixedAmountProps] = defineField('contributionFixedAmount', naiveConfig);

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