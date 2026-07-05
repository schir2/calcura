<script setup lang="ts">
import type {Hsa, HsaUpdate} from "#shared/types/Hsa";
import type {ManagerStates} from "#shared/types/ManagerStates";
import type {HsaState} from "#shared/types/HsaState";
import type {RichFacet} from "~/types/richListItem";

type Props = {
  hsa: Hsa
  isActive?: boolean
  expanded?: boolean
}
const {hsa, isActive = true, expanded = false} = defineProps<Props>()

const emit = defineEmits<{
  update: [id: number, update: HsaUpdate]
  delete: [id: number]
  toggle: []
}>()

const showModal = ref<boolean>(false)
const tone = 'text-skin-info'
const money = (value: number) => '$' + Math.round(value).toLocaleString('en-US')

function handleUpdate(id: number, update: HsaUpdate) {
  emit('update', id, update)
  showModal.value = false
}

const managerStates = inject<Ref<ManagerStates | null>>('managerStates')

const hsaStates = computed<HsaState[]>(
    () => (managerStates?.value?.hsa?.[hsa.id] as HsaState[]) ?? []
)

// Per-year balance series; the headline is the last point = projected balance at retirement.
const series = computed<number[]>(() => {
  const points = hsaStates.value.map(
      state => state.balance_end_of_year ?? state.balance_start_of_year ?? 0
  )
  return points.length ? points : [hsa.initial_balance ?? 0]
})

const headlineValue = computed(() => series.value[series.value.length - 1] ?? 0)

const strategyFacet = computed<RichFacet>(() => {
  switch (hsa.contribution_strategy) {
    case 'percentage_of_income':
      return {label: `${hsa.contribution_percentage ?? 0}% of income`, icon: 'growthRate'}
    case 'max':
      return {label: 'Maxing out', icon: 'fixed'}
    default:
      return {label: `${money(hsa.contribution_fixed_amount ?? 0)}/yr`, icon: 'fixed'}
  }
})

const facets = computed<RichFacet[]>(() => [
  strategyFacet.value,
  {label: `Growth ${hsa.growth_rate}%`, icon: 'growthRate'},
  {label: 'Triple tax-advantaged'},
])
</script>

<template>
  <n-modal v-model:show="showModal">
    <HsaUpdateForm :id="hsa.id" @update="handleUpdate" @cancel="showModal = false"/>
  </n-modal>

  <common-rich-list-item
      :expanded="expanded"
      @toggle="emit('toggle')"
      @edit="showModal = true"
      @delete="emit('delete', hsa.id)"
  >
    <template #icon>
      <base-ico name="hsa" :class="tone" class="text-xl shrink-0"/>
    </template>
    <template #title>
      <span class="font-medium truncate min-w-0">{{ hsa.name }}</span>
    </template>
    <template #strategy>
      <base-ico v-if="strategyFacet.icon" :name="strategyFacet.icon"/>
      {{ strategyFacet.label }}
    </template>
    <template #sparkline>
      <base-sparkline :series="series" :active="isActive" :tone="tone"/>
    </template>
    <template #headline>
      <div class="tabular-nums font-semibold" :class="tone">+{{ money(headlineValue) }}</div>
      <div class="text-[10px] text-skin-muted">at retirement</div>
    </template>

    <template #chart>
      <common-rich-list-item-chart :series="series" model-name="hsa" :active="isActive"/>
    </template>
    <template #aside>
      <div class="flex flex-col gap-3 text-xs">
        <div>
          <span class="text-skin-muted uppercase tracking-wide text-[10px]">Projection</span>
          <div class="flex justify-between mt-1">
            <span class="text-skin-muted">Today</span>
            <span class="tabular-nums font-medium" :class="tone">{{ money(series[0] ?? 0) }}</span>
          </div>
          <div class="flex justify-between mt-1">
            <span class="text-skin-muted">at retirement</span>
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
        <span class="mt-auto flex items-center gap-1 text-skin-info/70 cursor-not-allowed">
          <base-ico name="info"/> What is an HSA? <span class="text-[10px]">(soon)</span>
        </span>
      </div>
    </template>
  </common-rich-list-item>
</template>
