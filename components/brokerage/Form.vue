<script lang="ts" setup>
import {
  BrokerageContributionStrategy,
  type Brokerage, brokerageDefaults,
  type BrokeragePartial
} from "~/types/Brokerage";
import type {FormInst} from "naive-ui";
import {useBrokerageValidator} from "~/composables/validators/useBrokerageValidator";

interface Props {
  initialValues?: Partial<Brokerage>;
  mode: 'create' | 'edit' | 'view'
}

const {initialValues = brokerageDefaults, mode} = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);
const modelRef = ref<BrokeragePartial>(initialValues)
const formRef = ref<FormInst | null>(null);
const {handleCreate, handleUpdate, handleCancel} = useCrudForm(emit, formRef, modelRef)
const {rules} = useBrokerageValidator(modelRef)


export type BrokerageProjection = {
  data: number[]
  totalContributions: number
  totalGrowthAccrued: number
  totalSavings: number
}


// function generateBrokerageProjection(brokerageConfig: Brokerage, maxIterations: number = 20): BrokerageProjection {
//   let totalContributions = 0
//   let totalGrowthAccrued = 0
//   let i = 0
//   const data: number[] = [brokerageConfig.initialBalance]
//   while (i < maxIterations && data[i] > 0) {
//     const payment = calculateBrokerageContribution(brokerageConfig,);
//     const interest = (data[i] - payment) * (brokerageConfig.interestRate / 100)
//     const principal = data[i] - payment + interest
//     totalContributions += payment
//     totalGrowthAccrued += interest
//     data.push(principal)
//     i++
//   }
//   const totalSavings = data[data.length - 1]
//   const isPaid = totalSavings === 0
//   return {
//     data: data,
//     totalContributions: totalContributions,
//     totalGrowthAccrued: totalGrowthAccrued,
//     totalSavings: totalSavings
//   }
// }
//
//
// const projections = computed<Record<BrokerageContributionStrategy, BrokerageProjection>>(() => {
//   const brokeragePartial: Partial<Omit<Brokerage, 'contributionStrategy'>> = {
//     name: name.value,
//     growthRate: growthRate.value,
//     initialBalance: initialBalance.value,
//     contributionPercentage: contributionPercentage.value,
//     contributionFixedAmount: contributionFixedAmount.value,
//   };
//
//   const result = {} as Record<BrokerageContributionStrategy, BrokerageProjection>;
//
//   for (const contributionStrategy of Object.values(BrokerageContributionStrategy)) {
//     const brokerage: Brokerage = {
//       ...brokeragePartial,
//       contributionStrategy: contributionStrategy as BrokerageContributionStrategy,
//     } as Brokerage;
//
//     result[contributionStrategy as BrokerageContributionStrategy] = generateBrokerageProjection(brokerage, 30);
//   }
//   return result;
// });
</script>
<template>
  <n-card role="dialog" class="max-w-4xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Brokerage : {{ modelRef.name }}</h3>
    </template>

    <template #default>
      <n-form ref="formRef" :model="modelRef" :rules="rules">
        <section class="grid grid-cols-3 gap-3">
          <n-form-item label="Name" path="name">
            <n-input v-model:value="modelRef.name" placeholder="Enter investment name"/>
          </n-form-item>

          <n-form-item label="Initial Balance" path="initialBalance">
            <n-input-number class="w-full" v-model:value="modelRef.initialBalance" placeholder="Enter initial balance"/>
          </n-form-item>

          <n-form-item label="Growth Rate (%)" path="growthRate">
            <n-input-number class="w-full" v-model:value="modelRef.growthRate" placeholder="Enter growth rate"/>
          </n-form-item>
        </section>
        <n-form-item label="Contribution Strategy" path="contributionStrategy">
          <div class="grid grid-cols-3 gap-3 w-full">
            <CommonRadioCard v-model="modelRef.contributionStrategy" :value="BrokerageContributionStrategy.Fixed"
                             title="Fixed">
              <n-form-item label="Fixed Contribution Amount" path="contributionFixedAmount">
                <n-input-number class="w-full" v-model:value="modelRef.contributionFixedAmount"
                                placeholder="Enter fixed amount"/>
              </n-form-item>
            </CommonRadioCard>
            <CommonRadioCard v-model="modelRef.contributionStrategy"
                             :value="BrokerageContributionStrategy.PercentageOfIncome" title="Percentage of Income">
              <n-form-item label="Contribution Percentage (%)" path="contributionPercentage">
                <n-input-number class="w-full" v-model:value="modelRef.contributionPercentage"
                                placeholder="Enter percentage"/>
              </n-form-item>
            </CommonRadioCard>
            <CommonRadioCard v-model="modelRef.contributionStrategy" :value="BrokerageContributionStrategy.Max"
                             title="Max Out"/>
          </div>
        </n-form-item>

      </n-form>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>
