<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Roth IRA Investment: {{ rothIraInvestmentPartial.name }}</h3>
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
                <h4 class="text-lg font-semibold text-skin-success">
                  <Icon name="mdi-thumbs-up"/>
                  Pros
                </h4>
              </template>
              <ul class="list-disc list-inside">
                <li>Tax-free growth and withdrawals in retirement.</li>
                <li>No Required Minimum Distributions (RMDs).</li>
                <li>Flexible withdrawal of contributions anytime.</li>
              </ul>
            </n-card>
            <n-card size="small" class="bg-skin-error/5">
              <h4 class="text-lg font-semibold text-skin-error">
                <Icon name="mdi:thumbs-down"/>
                Cons
              </h4>
              <ul class="list-disc list-inside">
                <li>No immediate tax deduction for contributions.</li>
                <li>Income limits restrict eligibility.</li>
                <li>Early withdrawals of earnings may incur penalties.</li>
              </ul>
            </n-card>
            <n-card size="small" class="bg-skin-warning/5">
              <h4 class="text-lg font-semibold text-skin-warning">
                <icon name="mdi:warning"/>
                Things to Note
              </h4>
              <ul class="list-disc list-inside">
                <li>Contribution limits are $7,000 ($8,000 if 50+).</li>
                <li>Account must be open for 5 years for qualified earnings withdrawals.</li>
                <li>Ideal if you expect to be in a higher tax bracket later.</li>
              </ul>
            </n-card>
          </section>

        </n-card>
        <section class="grid grid-cols-3 gap-3">
          <n-form-item path="name" :label="rothIraInvestmentForm.name.label" v-bind="nameProps">
            <n-input v-model:value="name"/>
          </n-form-item>
          <n-form-item path="initialBalance" :label="rothIraInvestmentForm.initialBalance.label" v-bind="initialBalanceProps">
            <n-input-number class="w-full" v-model:value="initialBalance"/>
          </n-form-item>
          <n-form-item path="growthRate" :label="rothIraInvestmentForm.growthRate.label" v-bind="growthRateProps">
            <n-input-number class="w-full" v-model:value="growthRate"/>
          </n-form-item>
        </section>
        <n-form-item path="contributionStrategy" :label="rothIraInvestmentForm.contributionStrategy.label" v-bind="contributionStrategyProps">
          <div class="grid grid-cols-3 gap-3">
            <CommonRadioCard v-model="contributionStrategy" :value="RothIraContributionStrategy.Fixed" title="Fixed Payment">
              <n-form-item path="contributionFixedAmount" :label="rothIraInvestmentForm.contributionFixedAmount.label" v-bind="contributionFixedAmountProps">
                <n-input-number class="w-full" v-model:value="contributionFixedAmount" :precision="2" :min="0" :max="8000">
                  <template #prefix>$</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>
                  You commit to contributing a set dollar amount to your Roth IRA every year.
                </p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p class="mt-1">
                  Enter the specific amount you want to invest annually, regardless of income changes or other factors.
                </p>
              </section>
            </CommonRadioCard>
            <CommonRadioCard v-model="contributionStrategy" :value="RothIraContributionStrategy.PercentageOfIncome" title="Percentage of Income">
              <n-form-item path="contributionPercentage" :label="rothIraInvestmentForm.contributionPercentage.label" v-bind="contributionPercentageProps">
                <n-input-number class="w-full" v-model:value="contributionPercentage" :precision="2">
                  <template #prefix>%</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>
                  Your annual contribution is based on a percentage of your income, adjusting as your income changes.
                </p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p class="mt-1">
                  Specify a percentage (e.g., 10%) of your income. The actual dollar amount contributed each year will vary based on your income.
                </p>
              </section>
            </CommonRadioCard>
            <CommonRadioCard v-model="contributionStrategy" :value="RothIraContributionStrategy.Max" title="Maximum">
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
import {rothIraInvestmentForm, rothIraInvestmentFormSchema} from "~/forms/rothIraInvestmentForm";
import {useForm} from "vee-validate";
import {RothIraContributionStrategy, type RothIraInvestment, type RothIraInvestmentPartial} from "~/models/rothIraInvestment/RothIraInvestment";
import {naiveConfig} from "~/utils/schemaUtils";

interface Props {
  rothIraInvestmentPartial: RothIraInvestment | RothIraInvestmentPartial;
  age?: number;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: rothIraInvestmentFormSchema,
  initialValues: props.rothIraInvestmentPartial,
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