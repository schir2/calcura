<script setup lang="ts">

import type {Brokerage, BrokerageInsert, BrokerageUpdate} from "#shared/types/Brokerage";
import {ModelName} from "#shared/types/ModelName";
import {calculateBrokerageContribution} from "~/models/brokerage/BrokerageManager";
import type {PlanState} from "#shared/types/PlanState";
import type {Income} from "#shared/types/Income";

type Props = {
  brokerage: Brokerage
  incomes: Income[]
}

const {brokerage} = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits<{
  create: [insert: BrokerageInsert]
  update: [id: number, update: BrokerageUpdate]
  delete: [id: number]
  remove: [brokerage: Brokerage]
}>()

function handleDelete() {
  emit('delete', brokerage.id)
}

function handleUpdate(b: Brokerage) {
  const {id, ...update} = b
  emit('update', id, update as BrokerageUpdate)
  showModal.value = false
}

function handleCreate(brokeragePartial: Partial<Brokerage>) {
  emit('create', brokeragePartial as BrokerageInsert)
  showModal.value = false
}

function handleRemove() {
  emit('remove', brokerage)
}

function handleClose() {
  showModal.value = false
}

function handleEdit() {
  showModal.value = true
}

const planStates = inject<Ref<PlanState[]>>('planStates')

const annualContribution = computed(() => {
  if (planStates?.value && planStates.value.length > 1) {
    return calculateBrokerageContribution(
        brokerage,
        planStates.value[0].gross_income,
        planStates.value[0].taxable_contributions_lifetime ?? 0
    )
  }
  return 0
})
</script>
<template>
  <n-modal v-model:show="showModal">
    <BrokerageForm :initialValues="brokerage" mode="edit"
                   @create="handleCreate"
                   @update="handleUpdate"
                   @cancel="handleClose"
    />
  </n-modal>

  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
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