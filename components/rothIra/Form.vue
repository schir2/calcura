<script lang="ts" setup>
import {type RothIra, rothIraDefaults} from "~/types/RothIra";

interface Props {
  initialValues?: Partial<RothIra>;
  mode: "create" | "edit";
}

const {initialValues = rothIraDefaults, mode} = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel} =
    useCrudFormWithValidation(initialValues, emit, useRothIraValidation);
</script>
<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Roth IRA : {{ modelRef.name }}</h3>
    </template>

    <template #default>
      <n-form ref="formRef" :model="modelRef" :rules="rules">
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
                <li>Contribution limits are $7,000 ($8,000 if age 50+).</li>
                <li>Account must be open for 5 years for qualified earnings withdrawals.</li>
                <li>Ideal if you expect to be in a higher tax bracket later.</li>
              </ul>
            </n-card>
          </section>
        </n-card>

        <section class="grid grid-cols-3 gap-3">
          <n-form-item path="name" label=" Name">
            <n-input v-model:value="modelRef.name" placeholder="Enter the name of the investment"/>
          </n-form-item>

          <n-form-item path="initialBalance" label="Current Savings">
            <n-input-number class="w-full" v-model:value="modelRef.initialBalance"
                            placeholder="Enter your current savings balance"/>
          </n-form-item>

          <n-form-item path="growthRate" label="Growth Rate">
            <n-input-number class="w-full" v-model:value="modelRef.growthRate"
                            placeholder="Enter expected growth rate"/>
          </n-form-item>
        </section>

        <n-form-item path="contributionStrategy" label="Contribution Strategy">
          <div class="grid grid-cols-3 gap-3">
            <CommonRadioCard v-model="modelRef.contributionStrategy" value="fixed" title="Fixed Payment">
              <n-form-item path="contributionFixedAmount" label="Annual Contribution">
                <n-input-number class="w-full" v-model:value="modelRef.contributionFixedAmount" :precision="2" :min="0"
                                :max="8000">
                  <template #prefix>$</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>You commit to contributing a set dollar amount to your Roth IRA every year.</p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p>Enter the specific amount you want to invest annually, ensuring it stays within IRS limits.</p>
              </section>
            </CommonRadioCard>

            <CommonRadioCard v-model="modelRef.contributionStrategy" value="percentage_of_income"
                             title="Percentage of Income">
              <n-form-item path="contributionPercentage" label="Contribution Percentage">
                <n-input-number class="w-full" v-model:value="modelRef.contributionPercentage" :precision="2">
                  <template #prefix>%</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>Your annual contribution is based on a percentage of your income, adjusting as your income
                  changes.</p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p>Specify a percentage (e.g., 10%) of your income. The actual dollar amount contributed each year will
                  vary based on your income.</p>
              </section>
            </CommonRadioCard>

            <CommonRadioCard v-model="modelRef.contributionStrategy" value="max" title="Maximum">
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>You aim to contribute the maximum allowed by the IRS every year.</p>

                <h3 class="text-lg font-semibold mt-3">How it’s calculated:</h3>
                <p>Automatically sets your annual contribution to the IRS maximum (e.g., $7,000 or $8,000 if you’re
                  50+).</p>
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