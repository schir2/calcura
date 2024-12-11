<template>
  <CommonCard>
    <Form class="space-y-6">
      <div class="flex justify-between align-middle">
        <h3 class="text-2xl">{{ brokerageInvestment.name }}</h3>
        <NButton iconLeft="mdi-delete" @click="handleDeleteInvestment(investmentIndex)">
        </NButton>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <FormField :model="brokerageInvestment" :field="fieldMetadata.name"/>
        <FormField :model="brokerageInvestment" :field="fieldMetadata.initialBalance"/>
        <FormField :model="brokerageInvestment" v-show="showAdvancedOptions" :field="fieldMetadata.growthRate"/>
      </div>
      <section>
        <h3 class="text-xl">Contributions</h3>
        <div class="grid grid-cols-3 gap-3">
          <FormSelect :model="brokerageInvestment" :field="fieldMetadata.contributionStrategy"/>
          <FormField :model="brokerageInvestment" :field="fieldMetadata.contributionPercentage"/>
          <FormField :model="brokerageInvestment" :field="fieldMetadata.contributionFixedAmount"/>
        </div>
      </section>
    </Form>
  </CommonCard>
</template>
<script setup lang="ts">
import BrokerageInvestment from "~/models/brokerage/BrokerageInvestment";
import {brokerageInvestmentFields} from "~/forms/brokerageInvestmentForm";
import {defaultBrokerageInvestmentFactory} from "~/models/brokerage/BrokerageInvestmentFactories";

const brokerageInvestment = reactive(defaultBrokerageInvestmentFactory())

const fieldMetadata = brokerageInvestmentFields

interface Props {
  showAdvancedOptions: boolean;
  investment: BrokerageInvestment;
  investmentIndex: number;
}

const {showAdvancedOptions = false, investment, investmentIndex} = defineProps<Props>()

const emit = defineEmits({
  deleteInvestment(payload: { index: number }) {
  }
})

function handleDeleteInvestment(investmentIndex: number) {
  emit('deleteInvestment', {index: investmentIndex})
}


</script>
