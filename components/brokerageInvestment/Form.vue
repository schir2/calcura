<template>
  <n-card role="dialog" class="max-w-4xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl">Brokerage Investment: {{ initialValues.name }}</h3>
    </template>

    <template #default>
      <n-form ref="formRef" :model="model" :rules="rules">
        <section class="grid grid-cols-3 gap-3">
          <n-form-item label="Name" path="name">
            <n-input v-model:value="model.name" placeholder="Enter investment name"/>
          </n-form-item>

          <n-form-item label="Initial Balance" path="initialBalance">
            <n-input-number class="w-full" v-model:value="model.initialBalance" placeholder="Enter initial balance"/>
          </n-form-item>

          <n-form-item label="Growth Rate (%)" path="growthRate">
            <n-input-number class="w-full" v-model:value="model.growthRate" placeholder="Enter growth rate"/>
          </n-form-item>
        </section>
        <n-form-item label="Contribution Strategy" path="contributionStrategy">
          <div class="grid grid-cols-3 gap-3 w-full">
            <CommonRadioCard v-model="model.contributionStrategy" :value="BrokerageContributionStrategy.Fixed" title="Fixed">
              <n-form-item label="Fixed Contribution Amount" path="contributionFixedAmount">
                <n-input-number class="w-full" v-model:value="model.contributionFixedAmount" placeholder="Enter fixed amount"/>
              </n-form-item>
            </CommonRadioCard>
            <CommonRadioCard v-model="model.contributionStrategy" :value="BrokerageContributionStrategy.PercentageOfIncome" title="Percentage of Income">
              <n-form-item label="Contribution Percentage (%)" path="contributionPercentage">
                <n-input-number class="w-full" v-model:value="model.contributionPercentage" placeholder="Enter percentage"/>
              </n-form-item>
            </CommonRadioCard>
            <CommonRadioCard v-model="model.contributionStrategy" :value="BrokerageContributionStrategy.Max" title="Max Out"/>
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
import {BrokerageContributionStrategy, type BrokerageInvestment, type BrokerageInvestmentPartial} from "~/models/brokerageInvestment/BrokerageInvestment";
import type {FormInst, FormItemRule, FormRules} from "naive-ui";
import {useMessage} from "naive-ui";

const message = useMessage()

interface Props {
  initialValues: Partial<BrokerageInvestment | BrokerageInvestmentPartial>;
  mode: 'create' | 'edit' | 'view'
}

const props = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const model = ref<BrokerageInvestmentPartial>(props.initialValues)

const formRef = ref<FormInst | null>(null);

function validateContributionFixedAmount(rule: FormItemRule, value: number | undefined) {
  console.log(value)
  if (model.value.contributionStrategy === BrokerageContributionStrategy.Fixed) {
    if (value === null || value === undefined) {
      return false
    }
  }
}

function validateContributionPercentage(rule: FormItemRule, value: number | undefined) {
  console.log(value, model.value.contributionStrategy)
  if (model.value.contributionStrategy === BrokerageContributionStrategy.PercentageOfIncome) {
    if (value === null || value === undefined) {
      return false
    }
  }
}

const rules: FormRules = {
  name: [
    {required: true, message: "Name is required", trigger: ['blur', 'change']},
    {min: 3, message: "Investment name must be at least 3 characters long", trigger: ["blur", "change"]},
    {max: 50, message: "Investment name must be at most 50 characters long", trigger: ["blur", "change"]}
  ],
  growthRate: [
    {required: true, type: 'number', message: "Growth rate is required", trigger: ["blur", "change"]},
    {type: "number", min: 0, message: "Growth rate cannot be negative", trigger: ["blur", "change"]},
    {type: "number", max: 100, message: "Growth rate must be less than or equal to 100", trigger: ["blur", "change"]}
  ],
  initialBalance: [
    {required: true, type: 'number', message: "Initial balance is required", trigger: ["blur", "change"]},
    {type: "number", min: 0, message: "Initial balance cannot be negative", trigger: ["blur", "change"]}
  ],
  contributionStrategy: [
    {required: true, message: "Contribution strategy is required", trigger: ["blur", "change"]}
  ],
  contributionPercentage: [
    {validator: validateContributionPercentage, message: 'Contribution Percentage is required when Percentage of Income Contribution strategy is selected', trigger: ['blur', 'change']},
    {type: "number", min: 0, message: "Contribution percentage cannot be negative", trigger: ["blur", "change"]},
    {type: "number", max: 100, message: "Contribution percentage must be less than or equal to 100", trigger: ["blur", "change"]}
  ],
  contributionFixedAmount: [
    {validator: validateContributionFixedAmount, message: 'Fixed contribution amount is required when Fixed Contribution strategy is selected', trigger: ['blur', 'change']},
    {type: 'number', message: "Fixed contribution amount is required", trigger: ["blur", "change"]},
    {type: "number", min: 0, message: "Contribution amount cannot be negative", trigger: ["blur", "change"]}
  ],
};

function handleCreate() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      emit('create', model.value)
    }
  })

}

function handleCancel() {
  emit('cancel')
}

function handleUpdate() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      emit('update', model.value)
    }
  })
}


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
</script>