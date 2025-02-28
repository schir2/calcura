<script lang="ts" setup>

import {type Debt, debtDefaults, DebtPaymentStrategy} from "~/types/Debt";
import {calculateDebtPayment} from "~/models/debt/DebtManager";
import type {Plan} from "~/types/Plan";

interface Props {
  initialValues?: Partial<Debt>;
  mode: 'create' | 'edit' | 'view'
}

const {initialValues = debtDefaults, mode} = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel} =
    useCrudFormWithValidation<Plan>(initialValues, emit, useDebtValidation);

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
    const interest = (data[i] - payment) * (debtConfig.interestRate / 100)
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
  const debtPartial: Partial<Omit<Debt, 'paymentStrategy'>> = {
    interestRate: modelRef.value.interestRate,
    principal: modelRef.value.principal,
    name: modelRef.value.name,
    paymentFixedAmount: modelRef.value.paymentFixedAmount,
    paymentMinimum: modelRef.value.paymentMinimum,
    paymentPercentage: modelRef.value.paymentPercentage,
  };

  const result = {} as Record<DebtPaymentStrategy, DebtProjection>;

  for (const paymentStrategy of Object.values(DebtPaymentStrategy)) {
    const debtConfig: Debt = {
      ...debtPartial,
      paymentStrategy: paymentStrategy as DebtPaymentStrategy,
    } as Debt;

    result[paymentStrategy as DebtPaymentStrategy] = generateDebtProjection(debtConfig, 30);
  }
  return result;
});
</script>
<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Debt: {{ modelRef.name }}</h3>
    </template>

    <template #default>
      <n-form ref="formRef" :model="modelRef" :rules="rules">
        <section class="grid grid-cols-3 gap-3">
          <n-form-item path="name" label="Debt Name">
            <n-input v-model:value="modelRef.name" placeholder="Enter debt name"/>
          </n-form-item>

          <n-form-item path="principal" label="Principal Amount">
            <n-input-number class="w-full" v-model:value="modelRef.principal" placeholder="Enter principal amount"/>
          </n-form-item>

          <n-form-item path="interestRate" label="Interest Rate (%)">
            <n-input-number class="w-full" v-model:value="modelRef.interestRate" size="small"
                            placeholder="Enter interest rate"/>
          </n-form-item>
        </section>

        <n-form-item path="paymentStrategy" label="Payment Strategy">
          <section class="grid grid-cols-4 gap-3">
            <DebtProjectionCard :projection="projections.fixed" title="Fixed Payment"
                                v-model="modelRef.paymentStrategy" :value="DebtPaymentStrategy.Fixed">
              <template #inputs>
                <n-form-item path="paymentFixedAmount"
                             label="Fixed Payment Amount">
                  <n-input-number class="w-full" v-model:value="modelRef.paymentFixedAmount" :step="100" :precision="2"
                                  :max="modelRef.principal"
                                  placeholder="Enter fixed payment amount">
                    <template #prefix>$</template>
                  </n-input-number>
                </n-form-item>
              </template>
            </DebtProjectionCard>

            <DebtProjectionCard :projection="projections.percentage_of_debt" title="Percentage of Debt"
                                v-model="modelRef.paymentStrategy" :value="DebtPaymentStrategy.PercentageOfDebt">
              <template #inputs>
                <n-form-item path="paymentPercentage"
                             label="Payment Percentage">
                  <n-input-number class="w-full" v-model:value="modelRef.paymentPercentage" :precision="2"
                                  placeholder="Enter payment percentage">
                    <template #suffix>%</template>
                  </n-input-number>
                </n-form-item>
              </template>
            </DebtProjectionCard>

            <DebtProjectionCard :projection="projections.minimum_payment" title="Minimum Payment"
                                v-model="modelRef.paymentStrategy" :value="DebtPaymentStrategy.MinimumPayment">
              <template #inputs>
                <n-form-item path="paymentMinimum"
                             label="Minimum Payment (Monthly)">
                  <n-input-number class="w-full" v-model:value="modelRef.paymentMinimum" :precision="2"
                                  placeholder="Enter minimum monthly payment">
                    <template #prefix>$</template>
                    <template #suffix>per month</template>
                  </n-input-number>
                </n-form-item>
              </template>
            </DebtProjectionCard>

            <DebtProjectionCard :projection="projections.maximum_payment" title="Maximum Payment"
                                v-model="modelRef.paymentStrategy" :value="DebtPaymentStrategy.MaximumPayment"/>
          </section>
        </n-form-item>

        <DebtProjectionChart :projections="projections"/>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons v-if="mode !== 'view'" :mode="mode" @update="handleUpdate"
                         @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>


</template>