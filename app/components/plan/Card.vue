<script setup lang="ts">
import type {PlanWithRelations} from '#shared/types/Plan'
import type {PlanProjection} from '~/composables/usePlanSimulations'
import {compactMoney, headlineGoal, strategyLabel} from '~/utils'

const {plan, projection, loading = false} = defineProps<{
    plan: PlanWithRelations
    projection: PlanProjection
    loading?: boolean
}>()

// No edit affordance here: plan settings are edited in the Workspace drawer, whose projection
// pane needs a loaded orchestrator + command sequence — neither exists on the listing page
// (ADR 015). "Open" leads to the detail page, where Plan settings lives.
const emit = defineEmits<{
    duplicate: [id: number]
    delete: [id: number]
}>()

const chips = computed(() => {
    const investments = plan.brokerages.length + plan.iras.length + plan.roth_iras.length + plan.tax_deferreds.length + plan.hsas.length
    const out: { label: string; type: 'primary' | 'info' | 'warning' | 'error' }[] = [
        {label: `${plan.incomes.length} income${plan.incomes.length === 1 ? '' : 's'}`, type: 'primary'},
        {label: `${investments} investment${investments === 1 ? '' : 's'}`, type: 'info'},
        {label: `${plan.expenses.length} expense${plan.expenses.length === 1 ? '' : 's'}`, type: 'warning'},
    ]
    if (plan.debts.length) {
        out.push({label: `${plan.debts.length} debt${plan.debts.length === 1 ? '' : 's'}`, type: 'error'})
    }
    return out
})

const showDeletePopConfirm = ref(false)

function handleDelete() {
    showDeletePopConfirm.value = false
    emit('delete', plan.id)
}
</script>

<template>
  <n-card
      size="small"
      hoverable
      class="h-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-elevation-3 hover:border-skin-primary"
  >
    <div class="flex flex-col gap-3">
      <!-- headline -->
      <div>
        <NuxtLink :to="{ name: 'plans-id', params: { id: plan.id } }">
          <h3 class="text-lg font-semibold text-skin-base hover:text-skin-primary">{{ plan.name }}</h3>
        </NuxtLink>
        <p class="text-sm text-skin-muted leading-relaxed mt-0.5">
          Aims to <span class="text-skin-base font-medium">{{ strategyLabel(plan.retirement_strategy).toLowerCase() }}</span>,
          retiring at <span class="text-skin-base font-medium">{{ plan.retirement_age ?? '—' }}</span>
          on a <span class="text-skin-base font-medium">{{ compactMoney(headlineGoal(plan)) }}</span> goal.
        </p>
      </div>

      <!-- composition chips -->
      <div class="flex flex-wrap gap-1.5">
        <n-tag v-for="chip in chips" :key="chip.label" size="small" round :bordered="false" :type="chip.type">
          {{ chip.label }}
        </n-tag>
      </div>

      <!-- lifetime projection -->
      <PlanChartLifetimeBalance :projection="projection" :loading="loading"/>
    </div>

    <template #action>
      <div class="flex flex-wrap gap-2">
        <n-button size="small" type="primary" secondary @click="navigateTo({ name: 'plans-id', params: { id: plan.id } })">
          <template #icon><Icon name="mdi:open-in-new"/></template>
          Open
        </n-button>
        <n-button size="small" secondary :disabled="loading" @click="emit('duplicate', plan.id)">
          <template #icon><Icon name="mdi:content-copy"/></template>
          Duplicate
        </n-button>
        <n-popconfirm v-model:show="showDeletePopConfirm">
          <template #trigger>
            <n-button size="small" type="error" secondary>
              <template #icon><Icon name="mdi:delete"/></template>
              Delete
            </n-button>
          </template>
          <template #action>
            <n-button tertiary round @click="showDeletePopConfirm = false">Cancel</n-button>
            <n-button tertiary type="error" round @click="handleDelete">
              <template #icon><Icon name="mdi:delete"/></template>
              Delete
            </n-button>
          </template>
          <div class="max-w-md px-3 pe-3">
            <h2 class="text-xl my-3 text-skin-error font-semibold">Delete Plan</h2>
            <p>Are you sure you want to delete this plan?</p>
            <p class="text-skin-info text-xs mb-2">This will permanently remove the plan and all associated data.</p>
          </div>
        </n-popconfirm>
      </div>
    </template>
  </n-card>
</template>