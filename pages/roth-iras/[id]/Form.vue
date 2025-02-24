<script setup lang="ts">
import type {RothIraInvestment} from "~/types/RothIraInvestment";

const route = useRoute()
const rothIraInvestmentId = Number(route.params.id)
const rothIraInvestment = ref<RothIraInvestment | null>(null);
const rothIraInvestmentService = useRothIraInvestmentService()
onMounted(async () => {
  if (rothIraInvestmentId) {
    rothIraInvestment.value = await rothIraInvestmentService.get(rothIraInvestmentId)
  }
})
</script>
<template>
  <RothIraInvestmentForm v-if="rothIraInvestment" mode="view" :initialValues="rothIraInvestment"></RothIraInvestmentForm>
</template>