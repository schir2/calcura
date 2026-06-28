<script lang="ts" setup>
import type { Debt, DebtInsert, DebtPaymentStrategy } from "#shared/types/Debt"
import { debtRules } from "~/utils/validators/debtRules"
import { calculateDebtPayment } from "~/models/debt/DebtManager"
import { FORM_LABEL_ALIGN, FORM_LABEL_PLACEMENT } from "~/constants/FormConstants"
import type { Frequency } from "#shared/types/Frequency"
import { debtDefaults } from "~/constants/DebtConstants"

type Props = { initialValues?: Partial<Debt> }
const props = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: DebtInsert]
  cancel: []
}>()

const model = ref<Partial<Debt>>({ ...debtDefaults, ...props.initialValues })
const { formRef, pending, rules, apiErrors, onSubmit } = useNaiveForm(model)
const errorMessage = ref('')
rules.value = debtRules(model).rules

export type DebtProjection = {
  data: number[]
  totalPaymentsMade: number
  totalInterestAccrued: number
  isPaid: boolean
  remainingDebt: number
}

function generateDebtProjection(debtConfig: Debt, maxIterations: number = 20): DebtProjection {
  let totalPaymentsMade = 0
  let totalInterestAccrued = 0
  let i = 0
  const data: number[] = [debtConfig.principal]
  while (i < maxIterations && data[i] > 0) {
    const payment = calculateDebtPayment(debtConfig, data[i])
    const interest = (data[i] - payment) * (debtConfig.interest_rate / 100)
    const principal = data[i] - payment + interest
    totalPaymentsMade += payment
    totalInterestAccrued += interest
    data.push(principal)
    i++
  }
  const remainingDebt = data[data.length - 1]
  const isPaid = remainingDebt === 0
  return {
    data: data,
    totalPaymentsMade: totalPaymentsMade,
    totalInterestAccrued: totalInterestAccrued,
    isPaid: isPaid,
    remainingDebt: remainingDebt
  }
}

const projections = computed<Record<DebtPaymentStrategy, DebtProjection>>(() => {
  const debtPartial: Partial<Omit<Debt, 'payment_strategy'>> = {
    interest_rate: model.value.interest_rate,
    principal: model.value.principal,
    name: model.value.name,
    payment_fixed_amount: model.value.payment_fixed_amount,
    payment_minimum: model.value.payment_minimum,
    payment_percentage: model.value.payment_percentage,
    frequency: model.value.frequency,
  }

  const result = {} as Record<DebtPaymentStrategy, DebtProjection>

  const allStrategies: DebtPaymentStrategy[] = ['fixed', 'percentage_of_debt', 'minimum_payment', 'maximum_payment']
  for (const paymentStrategy of allStrategies) {
    const debtConfig: Debt = {
      ...debtPartial,
      payment_strategy: paymentStrategy,
    } as Debt

    result[paymentStrategy] = generateDebtProjection(debtConfig, 30)
  }
  return result
})

function handleSubmit() {
  onSubmit(async () => {
    const { id: _id, ...insert } = model.value as Debt
    emit('create', insert as DebtInsert)
  })
}
</script>
<template>
  <n-card role="dialog" class="max-w-4xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Debt: {{ model.name }}</h3>
    </template>

    <template #default>
      <n-alert v-if="Object.keys(apiErrors).length > 0" type="error" :title="errorMessage || 'An error occurred'" class="mb-4" />
      <n-form
          ref="formRef"
          :model="model"
          :rules="rules"
          :label-placement="FORM_LABEL_PLACEMENT"
          :label-align="FORM_LABEL_ALIGN"
      >
        <n-form-item path="name" label="Debt Name">
          <n-input v-model:value="model.name" placeholder="Enter debt name"/>
        </n-form-item>

        <n-form-item path="principal" label="Principal Amount">
          <n-input-number class="w-full" v-model:value="model.principal" placeholder="Enter principal amount"/>
        </n-form-item>

        <n-form-item path="interestRate" label="Interest Rate (%)">
          <n-input-number class="w-full" v-model:value="model.interest_rate" size="small"
                          placeholder="Enter interest rate"/>
        </n-form-item>

        <n-form-item path="frequency" label="Payment Frequency">
          <n-radio-group v-model:value="model.frequency">
            <n-radio-button v-for="option in [
              { label: 'Weekly', value: 'weekly' as Frequency },
              { label: 'Biweekly', value: 'biweekly' as Frequency },
              { label: 'Monthly', value: 'monthly' as Frequency },
              { label: 'Quarterly', value: 'quarterly' as Frequency },
              { label: 'Annual', value: 'annual' as Frequency }
            ]" :key="option.value" :label="option.label" :value="option.value"/>
          </n-radio-group>
        </n-form-item>

        <n-form-item path="paymentStrategy" label="Payment Strategy" label-placement="top">
          <section class="grid grid-cols-4 gap-3">
            <DebtProjectionCard :projection="projections.fixed" title="Fixed"
                                v-model="model.payment_strategy" :value="'fixed'">
              <template #inputs>
                <n-form-item
                    path="paymentFixedAmount"
                    label="Fixed Payment Amount"
                    label-placement="top"
                >
                  <n-input-number class="w-full" v-model:value="model.payment_fixed_amount" :step="100"
                                  :precision="2"
                                  :max="model.principal"
                                  placeholder="Enter fixed payment amount">
                    <template #prefix>$</template>
                  </n-input-number>
                </n-form-item>
              </template>
            </DebtProjectionCard>

            <DebtProjectionCard :projection="projections.percentage_of_debt" title="Percentage"
                                v-model="model.payment_strategy" :value="'percentage_of_debt'">
              <template #inputs>
                <n-form-item
                    path="paymentPercentage"
                    label="Payment Percentage"
                    label-placement="top"
                >
                  <n-input-number class="w-full" v-model:value="model.payment_percentage" :precision="2"
                                  placeholder="Enter payment percentage">
                    <template #suffix>%</template>
                  </n-input-number>
                </n-form-item>
              </template>
            </DebtProjectionCard>

            <DebtProjectionCard :projection="projections.minimum_payment" title="Minimum"
                                v-model="model.payment_strategy" :value="'minimum_payment'">
              <template #inputs>
                <n-form-item
                    path="paymentMinimum"
                    label="Minimum Payment"
                    label-placement="top">
                  <n-input-number class="w-full" v-model:value="model.payment_minimum" :precision="2"
                                  placeholder="Enter minimum payment">
                    <template #prefix>$</template>
                    <template #suffix>per month</template>
                  </n-input-number>
                </n-form-item>
              </template>
            </DebtProjectionCard>

            <DebtProjectionCard :projection="projections.maximum_payment" title="Maximum"
                                v-model="model.payment_strategy" :value="'maximum_payment'"/>
          </section>
        </n-form-item>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons variant="create" @create="handleSubmit" @cancel="emit('cancel')" />
    </template>
  </n-card>
</template>