<template>
  <h2 class="text-2xl mb-2">My Plans</h2>
  <n-card v-for="plan in plans" :key="plan.id">
    <div class="flex gap-2 flex-wrap">
      <dashboard-income-annual @click="$router.push('/incomes')" class="w-64" :incomes="plan.incomes"/>
      <dashboard-cash-reserve-total @click="$router.push('/cash-reserves')" class="w-64"
                                    :cashReserves="plan.cashReserves"/>
      <dashboard-expense-annual @click="$router.push('/expenses')" class="w-64" :expenses="plan.expenses"/>
      <dashboard-debt-total @click="$router.push('/debts')" class="w-64" :debts="plan.debts"/>
    </div>

  </n-card>
</template>
<script lang="ts" setup>

import type {Plan} from "~/types/Plan";

definePageMeta({
      title: 'Dashboard',
      layout: 'default',
    }
)
const {data: plans, refresh} = useFetch<Plan[]>('api/plans')

onMounted(async () => {

      await refresh()
    }
)
</script>
