<script lang="ts" setup>
import type { RothIra, RothIraUpdate } from "#shared/types/RothIra"
import { rothIraRules } from "~/utils/validators/rothIraRules"

type Props = { id: number }
const props = defineProps<Props>()

const emit = defineEmits<{
  update: [id: number, update: RothIraUpdate]
  cancel: []
}>()

const store = useRothIraStore()
const model = ref<Partial<RothIra>>({})
const isFetching = ref(true)
const errorMessage = ref('')

const { formRef, pending, rules, apiErrors, onSubmit } = useNaiveForm(model)
rules.value = rothIraRules(model).rules

onMounted(async () => {
  try {
    const data = await store.fetch(props.id)
    model.value = { ...data }
  } catch {
    emit('cancel')
  } finally {
    isFetching.value = false
  }
})

function handleSubmit() {
  onSubmit(async () => {
    const { id: _id, ...update } = model.value as RothIra
    emit('update', props.id, update as RothIraUpdate)
  })
}
</script>
<template>
  <n-spin v-if="isFetching" />
  <n-card v-else role="dialog" class="max-w-6xl" :bordered="true">
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
              <n-form-item path="contribution_fixed_amount" label="Annual Contribution">
                <n-input-number class="w-full" v-model:value="model.contribution_fixed_amount" :precision="2" :min="0"
                                :max="8000">
                  <template #prefix>$</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>You commit to contributing a set dollar amount to your Roth IRA every year.</p>

                <h3 class="text-lg font-semibold mt-3">How it's calculated:</h3>
                <p>Enter the specific amount you want to invest annually, ensuring it stays within IRS limits.</p>
              </section>
            </CommonRadioCard>

            <CommonRadioCard v-model="model.contribution_strategy" value="percentage_of_income"
                             title="Percentage of Income">
              <n-form-item path="contribution_percentage" label="Contribution Percentage">
                <n-input-number class="w-full" v-model:value="model.contribution_percentage" :precision="2">
                  <template #prefix>%</template>
                  <template #suffix>per year</template>
                </n-input-number>
              </n-form-item>
              <section class="p-3">
                <h3 class="text-lg font-semibold">What it means:</h3>
                <p>Your annual contribution is based on a percentage of your income, adjusting as your income
                  changes.</p>

                <h3 class="text-lg font-semibold mt-3">How it's calculated:</h3>
                <p>Specify a percentage (e.g., 10%) of your income. The actual dollar amount contributed each year will
                  vary based on your income.</p>
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
      <FormActionButtons variant="update" @update="handleSubmit" @cancel="emit('cancel')" />
    </template>
  </n-card>
</template>