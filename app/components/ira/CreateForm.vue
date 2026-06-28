<script lang="ts" setup>
import type { Ira, IraInsert } from "#shared/types/Ira"
import { iraRules } from "~/utils/validators/iraRules"
import { iraDefaults } from "~/constants/IraConstants"

type Props = { initialValues?: Partial<Ira> }
const props = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: IraInsert]
  cancel: []
}>()

const model = ref<Partial<Ira>>({ ...iraDefaults, ...props.initialValues })
const { formRef, pending, rules, apiErrors, onSubmit } = useNaiveForm(model)
const errorMessage = ref('')
rules.value = iraRules(model).rules

function handleSubmit() {
  onSubmit(async () => {
    const { id: _id, ...insert } = model.value as Ira
    emit('create', insert as IraInsert)
  })
}
</script>
<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Roth IRA : {{ model.name }}</h3>
    </template>

    <template #default>
      <n-alert v-if="Object.keys(apiErrors).length > 0" type="error" :title="errorMessage || 'An error occurred'" class="mb-4" />
      <n-form ref="formRef" :model="model" :rules="rules">
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
                <li>Contributions may be tax-deductible, providing immediate tax savings.</li>
                <li>Earnings grow tax-deferred, meaning you won't pay taxes on gains until you withdraw.</li>
                <li>Available to anyone with earned income, regardless of employer retirement plans.</li>
              </ul>
            </n-card>
            <n-card size="small" class="bg-skin-error/5">
              <h4 class="text-lg font-semibold text-skin-error">
                <Icon name="mdi:thumbs-down"/>
                Cons
              </h4>
              <ul class="list-disc list-inside">
                <li>Withdrawals in retirement are taxed as ordinary income.</li>
                <li>Required Minimum Distributions (RMDs) must start at age 73.</li>
                <li>Early withdrawals (before age 59½) are subject to a 10% penalty plus taxes, with limited
                  exceptions.
                </li>
              </ul>
            </n-card>
            <n-card size="small" class="bg-skin-warning/5">
              <h4 class="text-lg font-semibold text-skin-warning">
                <icon name="mdi:warning"/>
                Things to Note
              </h4>
              <ul class="list-disc list-inside">
                <li>Contribution limits are $7,000 ($8,000 if age 50+ for catch-up contributions).</li>
                <li>Deductibility of contributions depends on income and participation in an employer-sponsored plan.
                </li>
                <li>Ideal for those who anticipate being in a lower tax bracket in retirement.</li>
              </ul>
            </n-card>
          </section>
        </n-card>

        <section class="grid grid-cols-3 gap-3">
          <n-form-item path="name" label=" Name">
            <n-input v-model:value="model.name" placeholder="Enter the name of the investment"/>
          </n-form-item>

          <n-form-item path="initial_balance" label="Current Savings">
            <n-input-number class="w-full" v-model:value="model.initial_balance"
                            placeholder="Enter your current savings balance"/>
          </n-form-item>

          <n-form-item path="growth_rate" label="Growth Rate">
            <n-input-number class="w-full" v-model:value="model.growth_rate"
                            placeholder="Enter expected growth rate"/>
          </n-form-item>
        </section>

        <n-form-item path="contribution_strategy" label="Contribution Strategy">
          <div class="grid grid-cols-3 gap-3">
            <CommonRadioCard v-model="model.contribution_strategy" value="fixed" title="Fixed Payment">
              <n-form-item path="contribution_fixed_amount" label="Elective Contribution Fixed Amount">
                <n-input-number class="w-full" v-model:value="model.contribution_fixed_amount" :precision="2"
                                :min="0"
                                :max="8000">
                  <template #prefix>$</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>You commit to contributing a set dollar amount to your Traditional IRA every year.</p>

                <h3 class="text-lg font-semibold mt-3">How it's calculated:</h3>
                <p>Enter a specific annual amount you wish to invest, ensuring it stays within IRS limits.</p>
              </section>
            </CommonRadioCard>

            <CommonRadioCard v-model="model.contribution_strategy" value="percentage_of_income"
                             title="Percentage of Income">
              <n-form-item path="contribution_percentage" label="Elective Contribution Percentage">
                <n-input-number class="w-full" v-model:value="model.contribution_percentage" :precision="2">
                  <template #prefix>%</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>Your contributions are based on a percentage of your income, automatically adjusting as your earnings
                  change.</p>

                <h3 class="text-lg font-semibold mt-3">How it's calculated:</h3>
                <p>Specify a percentage (e.g., 10%) of your income. The dollar amount contributed will vary annually
                  based on your income.</p>
              </section>
            </CommonRadioCard>

            <CommonRadioCard v-model="model.contribution_strategy" value="max" title="Maximum">
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>You aim to contribute the maximum allowed by the IRS every year.</p>

                <h3 class="text-lg font-semibold mt-3">How it's calculated:</h3>
                <p>Automatically sets your annual contribution to the IRS maximum (e.g., $7,000 or $8,000 if you're
                  50+).</p>
              </section>
            </CommonRadioCard>
          </div>
        </n-form-item>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons variant="create" @create="handleSubmit" @cancel="emit('cancel')" />
    </template>
  </n-card>
</template>