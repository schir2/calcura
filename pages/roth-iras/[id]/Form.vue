<script setup lang="ts">
import type {RothIra} from "~/types/RothIra";

const route = useRoute()
const rothIraInvestmentId = Number(route.params.id)
const rothIraInvestment = ref<RothIra | null>(null);
const rothIraInvestmentService = useRothIraInvestmentService()
onMounted(async () => {
  if (rothIraInvestmentId) {
    rothIraInvestment.value = await rothIraInvestmentService.get(rothIraInvestmentId)
  }
})
</script>
<template>
  <RothIraForm v-if="rothIraInvestment" mode="view" :initialValues="rothIraInvestment"></RothIraForm>
</template>