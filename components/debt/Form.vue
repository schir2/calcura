<script lang="ts" setup>

import {type Debt, debtDefaults, DebtPaymentStrategy} from "~/types/Debt";
import {calculateDebtPayment} from "~/models/debt/DebtManager";
import {useCrudFormWithValidation} from "~/composables/useCrudFormWithValidation";
import {FORM_LABEL_ALIGN, FORM_LABEL_PLACEMENT} from "~/constants/FormConstants";
import {Frequency} from "~/types/Frequency";

interface Props {
  initialValues?: Partial<Debt>;
  mode: 'create' | 'edit'
}

const {initialValues = debtDefaults, mode} = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel} =
    useCrudFormWithValidation<Debt>(initialValues, emit, useDebtValidation);

const paymentStrategyOptions = [
  {label: "Fixed Payment", value: DebtPaymentStrategy.Fixed},
  {label: "Percentage of Debt", value: DebtPaymentStrategy.PercentageOfDebt},
  {label: "Pay Minimum", value: DebtPaymentStrategy.MinimumPayment},
  {label: "Pay Maximum", value: DebtPaymentStrategy.MaximumPayment}
]


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
    const payment = calculateDebtPayment(debtConfig, data[i]);
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
    interest_rate: modelRef.value.interest_rate,
    principal: modelRef.value.principal,
    name: modelRef.value.name,
    payment_fixed_amount: modelRef.value.payment_fixed_amount,
    payment_minimum: modelRef.value.payment_minimum,
    payment_percentage: modelRef.value.payment_percentage,
    frequency: modelRef.value.frequency,
  };

  const result = {} as Record<DebtPaymentStrategy, DebtProjection>;

  for (const paymentStrategy of Object.values(DebtPaymentStrategy)) {
    const debtConfig: Debt = {
      ...debtPartial,
      payment_strategy: paymentStrategy as DebtPaymentStrategy,
    } as Debt;

    result[paymentStrategy as DebtPaymentStrategy] = generateDebtProjection(debtConfig, 30);
  }
  return result;
});
</script>
<template>
  <n-card role="dialog" class="max-w-4xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Debt: {{ modelRef.name }}</h3>
    </template>

    <template #default>
      <n-form
          ref="formRef"
          :model="modelRef"
          :rules="rules"
          :label-placement="FORM_LABEL_PLACEMENT"
          :label-align="FORM_LABEL_ALIGN"
      >

        <n-form-item path="name" label="Debt Name">
          <n-input v-model:value="modelRef.name" placeholder="Enter debt name"/>
        </n-form-item>

        <n-form-item path="principal" label="Principal Amount">
          <n-input-number class="w-full" v-model:value="modelRef.principal" placeholder="Enter principal amount"/>
        </n-form-item>

        <n-form-item path="interestRate" label="Interest Rate (%)">
          <n-input-number class="w-full" v-model:value="modelRef.interest_rate" size="small"
                          placeholder="Enter interest rate"/>
        </n-form-item>
        <n-form-item path="frequency" label="Payment Frequency">
          <n-radio-group v-model:value="modelRef.frequency">
            <n-radio-button v-for="option in [
              { label: 'Weekly', value: Frequency.Weekly },
              { label: 'Biweekly', value: Frequency.Biweekly },
              { label: 'Monthly', value: Frequency.Monthly },
              { label: 'Quarterly', value: Frequency.Quarterly },
              { label: 'Annual', value: Frequency.Annually }
            ]" :key="option.value" :label="option.label" :value="option.value"/>
          </n-radio-group>
        </n-form-item>

        <n-form-item path="paymentStrategy" label="Payment Strategy"
                     label-placement="top">
          <section class="grid grid-cols-4 gap-3">
            <DebtProjectionCard :projection="projections.fixed" title="Fixed"
                                v-model="modelRef.payment_strategy" :value="DebtPaymentStrategy.Fixed">
              <template #inputs>
                <n-form-item
                    path="paymentFixedAmount"
                    label="Fixed Payment Amount"
                    label-placement="top"
                >
                  <n-input-number class="w-full" v-model:value="modelRef.payment_fixed_amount" :step="100" :precision="2"
                                  :max="modelRef.principal"
                                  placeholder="Enter fixed payment amount">
                    <template #prefix>$</template>
                  </n-input-number>
                </n-form-item>
              </template>
            </DebtProjectionCard>

            <DebtProjectionCard :projection="projections.percentage_of_debt" title="Percentage"
                                v-model="modelRef.payment_strategy" :value="DebtPaymentStrategy.PercentageOfDebt">
              <template #inputs>
                <n-form-item
                    path="paymentPercentage"
                    label="Payment Percentage"
                    label-placement="top"
                >
                  <n-input-number class="w-full" v-model:value="modelRef.payment_percentage" :precision="2"
                                  placeholder="Enter payment percentage">
                    <template #suffix>%</template>
                  </n-input-number>
                </n-form-item>
              </template>
            </DebtProjectionCard>

            <DebtProjectionCard :projection="projections.minimum_payment" title="Minimum"
                                v-model="modelRef.payment_strategy" :value="DebtPaymentStrategy.MinimumPayment">
              <template #inputs>
                <n-form-item
                    path="paymentMinimum"
                    label="Minimum Payment"
                    label-placement="top">
                  <n-input-number class="w-full" v-model:value="modelRef.payment_minimum" :precision="2"
                                  placeholder="Enter minimum payment">
                    <template #prefix>$</template>
                    <template #suffix>per month</template>
                  </n-input-number>
                </n-form-item>
              </template>
            </DebtProjectionCard>

            <DebtProjectionCard :projection="projections.maximum_payment" title="Maximum"
                                v-model="modelRef.payment_strategy" :value="DebtPaymentStrategy.MaximumPayment"/>
          </section>
        </n-form-item>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate"
                         @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>


</template>