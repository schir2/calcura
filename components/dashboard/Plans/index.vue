<script lang="ts" setup>
import type {Plan} from '~/types/Plan'

interface Props {
  plans?: Plan[]
}

const {plans = []} = defineProps<Props>()
</script>
<template>
  <n-card size="large">
    <template #header>
      <h2 class="text-2xl mb-2">My Retirement Plans</h2>
    </template>
    <n-list>
      <n-list-item>
        <n-empty description="It seems like you don't have any retirement plans.">
          <template #extra>
            <n-button type="primary">Add your first plan</n-button>
          </template>
        </n-empty>
      </n-list-item>
      <n-list-item :title="plan.name" v-for="plan in plans">
        <dashboard-plans-list-item :plan/>
      </n-list-item>
    </n-list>
  </n-card>
</template>