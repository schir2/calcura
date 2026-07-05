<script setup lang="ts">
import type {Income, IncomeUpdate} from "#shared/types/Income";
import type {ManagerStates} from "#shared/types/ManagerStates";
import type {IncomeState} from "#shared/types/IncomeState";
import type {RichFacet} from "~/types/richListItem";

type Props = {
  income: Income
  isActive?: boolean
  expanded?: boolean
}
const {income, isActive = true, expanded = false} = defineProps<Props>()

const emit = defineEmits<{
  update: [id: number, update: IncomeUpdate]
  delete: [id: number]
  toggle: []
}>()

const showModal = ref<boolean>(false)
const tone = 'text-skin-success'
const money = (value: number) => '$' + Math.round(value).toLocaleString('en-US')

function handleUpdate(id: number, update: IncomeUpdate) {
  emit('update', id, update)
  showModal.value = false
}

const managerStates = inject<Ref<ManagerStates | null>>('managerStates')

const incomeStates = computed<IncomeState[]>(
    () => (managerStates?.value?.income?.[income.id] as IncomeState[]) ?? []
)

// Per-year gross income series; the headline is year 0 = current annual gross.
const series = computed<number[]>(() => {
  const points = incomeStates.value.map(state => state.gross_income ?? 0)
  return points.length ? points : [income.gross_income ?? 0]
})

const headlineValue = computed(() => series.value[0] ?? 0)

const strategyFacet = computed<RichFacet | null>(() =>
    income.growth_rate ? {label: `Grows ${income.growth_rate}%/yr`, icon: 'growthRate'} : null
)

const facets = computed<RichFacet[]>(() => {
  const list: RichFacet[] = []
  if (strategyFacet.value) list.push(strategyFacet.value)
  list.push({label: income.frequency})
  return list
})
</script>

<template>
  <n-modal v-model:show="showModal">
    <IncomeUpdateForm :id="income.id" @update="handleUpdate" @cancel="showModal = false"/>
  </n-modal>

  <common-rich-list-item
      :expanded="expanded"
      @toggle="emit('toggle')"
      @edit="showModal = true"
      @delete="emit('delete', income.id)"
  >
    <template #icon>
      <base-ico name="income" :class="tone" class="text-xl shrink-0"/>
    </template>
    <template #title>
      <span class="font-medium truncate min-w-0">{{ income.name }}</span>
    </template>
    <template v-if="strategyFacet" #strategy>
      <base-ico v-if="strategyFacet.icon" :name="strategyFacet.icon"/>
      {{ strategyFacet.label }}
    </template>
    <template #sparkline>
      <base-sparkline :series="series" :active="isActive" :tone="tone"/>
    </template>
    <template #headline>
      <div class="tabular-nums font-semibold" :class="tone">+{{ money(headlineValue) }}</div>
      <div class="text-[10px] text-skin-muted">gross / yr</div>
    </template>

    <template #chart>
      <common-rich-list-item-chart :series="series" model-name="income" :active="isActive"/>
    </template>
    <template #aside>
      <div class="flex flex-col gap-3 text-xs">
        <div>
          <span class="text-skin-muted uppercase tracking-wide text-[10px]">Projection</span>
          <div class="flex justify-between mt-1">
            <span class="text-skin-muted">Today</span>
            <span class="tabular-nums font-medium" :class="tone">+{{ money(headlineValue) }}</span>
          </div>
          <div class="flex justify-between mt-1">
            <span class="text-skin-muted">gross / yr</span>
            <span class="tabular-nums font-medium" :class="tone">+{{ money(headlineValue) }}</span>
          </div>
        </div>
        <div>
          <span class="text-skin-muted uppercase tracking-wide text-[10px]">Configuration</span>
          <div v-for="facet in facets" :key="facet.label" class="flex items-center gap-1.5 mt-1 text-skin-base">
            <base-ico v-if="facet.icon" :name="facet.icon" :class="tone"/>
            {{ facet.label }}
          </div>
        </div>
        <span class="mt-auto flex items-center gap-1 text-skin-success/70 cursor-not-allowed">
          <base-ico name="info"/> What is an income? <span class="text-[10px]">(soon)</span>
        </span>
      </div>
    </template>
  </common-rich-list-item>
</template>
