<script setup lang="ts">
import type {Brokerage} from "~/types/Brokerage";

const route = useRoute()
const brokerageInvestmentId = Number(route.params.id)
const brokerageInvestment = ref<Brokerage | null>(null);
const brokerageInvestmentService = useBrokerageInvestmentService()
onMounted(async () => {
  if (brokerageInvestmentId) {
    brokerageInvestment.value = await brokerageInvestmentService.get(brokerageInvestmentId)
  }
})
</script>
<template>
  <BrokerageForm v-if="brokerageInvestment" mode="view" :initialValues="brokerageInvestment"></BrokerageForm>
</template>