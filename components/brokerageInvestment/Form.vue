<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Brokerage Investment: {{ brokerageInvestmentPartial.name }}</h3>
    </template>

    <template #default>
      <n-form>
        <n-form-item path="name" :label="brokerageInvestmentForm.name.label" v-bind="nameProps">
          <n-input v-model:value="name"/>
        </n-form-item>
        <n-form-item path="reserveAmount" :label="brokerageInvestmentForm.initialBalance.label" v-bind="initialBalanceProps">
          <n-input-number class="w-full" v-model:value="initialBalance">
            <template #prefix>
              <n-tag size="small">$</n-tag>
            </template>
          </n-input-number>
        </n-form-item>
        <n-form-item path="growthRate" :label="brokerageInvestmentForm.growthRate.label" v-bind="growthRateProps">
          <div class="flex flex-col w-full gap-3">
            <n-slider v-model:value="growthRate"/>
            <n-input-number size="small" :placeholder="brokerageInvestmentForm.growthRate.placeholder" v-model:value="growthRate">
              <template #prefix>
                <n-tag size="small">%</n-tag>
              </template>
            </n-input-number>
          </div>
        </n-form-item>
        <n-form-item path="contributionStrategy" :label="brokerageInvestmentForm.contributionStrategy.label" v-bind="contributionStrategyProps">
          <n-radio-group v-model:value="contributionStrategy">
            <n-radio-button v-for="option in brokerageInvestmentForm.contributionStrategy.options" :key="option.value" :value="option.value" :label="option.label"/>
          </n-radio-group>
        </n-form-item>
        <n-form-item class="w-full" v-if="contributionStrategy === 'percentage_of_income'" path="contributionPercentage" :label="brokerageInvestmentForm.contributionPercentage.label" v-bind="contributionPercentageProps">
          <div class="flex flex-col w-full gap-3">
            <n-slider v-model:value="contributionPercentage"></n-slider>
            <n-input-number v-model:value="contributionPercentage">
              <template #prefix>
                <n-tag size="small">%</n-tag>
              </template>
            </n-input-number>
          </div>
        </n-form-item>
        <n-form-item v-if="contributionStrategy === 'fixed'" path="contributionFixedAmount" :label="brokerageInvestmentForm.contributionFixedAmount.label" v-bind="contributionFixedAmountProps">
          <n-input-number class="w-full" v-model:value="contributionFixedAmount">
            <template #prefix>
              <n-tag size="small">$</n-tag>
            </template>
          </n-input-number>
        </n-form-item>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import {brokerageInvestmentForm, brokerageInvestmentFormSchema} from "~/forms/brokerageInvestmentForm";
import {useForm} from "vee-validate";
import {BrokerageContributionStrategy, type BrokerageInvestment, type BrokerageInvestmentPartial} from "~/models/brokerageInvestment/BrokerageInvestment";
import {naiveConfig} from "~/utils/schemaUtils";
import {calculateBrokerageInvestmentContribution} from "~/models/brokerageInvestment/BrokerageInvestmentManager";

interface Props {
  brokerageInvestmentPartial: Partial<BrokerageInvestment | BrokerageInvestmentPartial>;
  mode: 'create' | 'edit' | 'view'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {defineField, values, errors, handleSubmit, meta} = useForm({
  validationSchema: brokerageInvestmentFormSchema,
  initialValues: props.brokerageInvestmentPartial,
});

const [name, nameProps] = defineField('name', naiveConfig);
const [growthRate, growthRateProps] = defineField('growthRate', naiveConfig);
const [initialBalance, initialBalanceProps] = defineField('initialBalance', naiveConfig);
const [contributionStrategy, contributionStrategyProps] = defineField('contributionStrategy', naiveConfig);
const [contributionPercentage, contributionPercentageProps] = defineField('contributionPercentage', naiveConfig);
const [contributionFixedAmount, contributionFixedAmountProps] = defineField('contributionFixedAmount', naiveConfig);


export type BrokerageInvestmentProjection = {
  data: number[]
  totalContributions: number
  totalGrowthAccrued: number
  totalSavings: number
}


// function generateBrokerageInvestmentProjection(brokerageInvestmentConfig: BrokerageInvestment, maxIterations: number = 20): BrokerageInvestmentProjection {
//   let totalContributions = 0
//   let totalGrowthAccrued = 0
//   let i = 0
//   const data: number[] = [brokerageInvestmentConfig.initialBalance]
//   while (i < maxIterations && data[i] > 0) {
//     const payment = calculateBrokerageInvestmentContribution(brokerageInvestmentConfig,);
//     const interest = (data[i] - payment) * (brokerageInvestmentConfig.interestRate / 100)
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
// const projections = computed<Record<BrokerageContributionStrategy, BrokerageInvestmentProjection>>(() => {
//   const brokerageInvestmentPartial: Partial<Omit<BrokerageInvestment, 'contributionStrategy'>> = {
//     name: name.value,
//     growthRate: growthRate.value,
//     initialBalance: initialBalance.value,
//     contributionPercentage: contributionPercentage.value,
//     contributionFixedAmount: contributionFixedAmount.value,
//   };
//
//   const result = {} as Record<BrokerageContributionStrategy, BrokerageInvestmentProjection>;
//
//   for (const contributionStrategy of Object.values(BrokerageContributionStrategy)) {
//     const brokerageInvestment: BrokerageInvestment = {
//       ...brokerageInvestmentPartial,
//       contributionStrategy: contributionStrategy as BrokerageContributionStrategy,
//     } as BrokerageInvestment;
//
//     result[contributionStrategy as BrokerageContributionStrategy] = generateBrokerageInvestmentProjection(brokerageInvestment, 30);
//   }
//   return result;
// });


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