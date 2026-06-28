<script setup lang="ts">

import type {Brokerage, BrokerageUpdate} from "#shared/types/Brokerage";
import {calculateBrokerageContribution} from "~/models/brokerage/BrokerageManager";
import type {OrchestratorState} from "#shared/types/OrchestratorState";
import type {Income} from "#shared/types/Income";

type Props = {
  brokerage: Brokerage
  incomes: Income[]
}

const {brokerage} = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  update: [id: number, update: BrokerageUpdate]
  delete: [id: number]
}>()

function handleDelete() {
  emit('delete', brokerage.id)
}

function handleUpdate(id: number, update: BrokerageUpdate) {
  emit('update', id, update)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

function handleEdit() {
  showModal.value = true
}

const planStates = inject<Ref<OrchestratorState[]>>('planStates')

const annualContribution = computed(() => {
  if (planStates?.value && planStates.value.length > 1) {
    return calculateBrokerageContribution(
        brokerage,
        planStates.value[0].income.gross,
        planStates.value[0].assets.taxable.contribution_lifetime ?? 0
    )
  }
  return 0
})
</script>
<template>
  <n-modal v-model:show="showModal">
    <BrokerageUpdateForm :id="brokerage.id"
                         @update="handleUpdate"
                         @cancel="handleClose"
    />
  </n-modal>

  <command-list-item
      @edit="handleEdit" @delete="handleDelete"
      :title="brokerage.name"
      :modelName="'ira'"
      :tags="[
          {label: brokerage.contribution_strategy, },
          {label: `Growth ${brokerage.growth_rate}%`, iconName: 'growthRate', hide: brokerage.growth_rate === 0},
      ]">
    <template #summary>
      <span v-if="planStates">

      -${{ $humanize.intComma(annualContribution) }}/year
      </span>
    </template>
  </command-list-item>

</template>