<script setup lang="ts">
import type {BrokerageInvestment} from "~/types/BrokerageInvestment";

const route = useRoute()
const brokerageInvestmentId = Number(route.params.id)
const brokerageInvestment = ref<BrokerageInvestment | null>(null);
const brokerageInvestmentService = useBrokerageInvestmentService()
onMounted(async () => {
  if (brokerageInvestmentId) {
    brokerageInvestment.value = await brokerageInvestmentService.get(brokerageInvestmentId)
  }
})
</script>
<template>
  <BrokerageInvestmentForm v-if="brokerageInvestment" mode="view" :initialValues="brokerageInvestment"></BrokerageInvestmentForm>
</template>