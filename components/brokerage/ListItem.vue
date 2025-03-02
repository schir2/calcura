
<script setup lang="ts">

import type {Brokerage} from "~/types/Brokerage";
import {ModelName} from "~/types/ModelName";
import {calculateBrokerageContribution} from "~/models/brokerage/BrokerageManager";
import type {PlanState} from "~/types/PlanState";

interface Props {
  brokerage: Brokerage
}

const {brokerage} = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create', 'remove']);

function handleDelete() {
  emit('delete', brokerage);
}

function handleUpdate(brokerage: Partial<Brokerage>) {
  emit('update', brokerage)
  showModal.value = false;
}


function handleCreate(brokeragePartial: Partial<Brokerage>) {
  emit('create', brokeragePartial)
  showModal.value = false;
}


function handleRemove() {
  emit('remove', brokerage);
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}

const planStates = inject<Ref<PlanState[]>>('planStates')

const annualContribution = computed(() => {
  if (planStates?.value && planStates.value.length > 1) {
    return calculateBrokerageContribution(
        brokerage,
        planStates.value[0].grossIncome,
        planStates.value[0].taxableContributionsLifetime ?? 0
    )
  }
  return 0
})
</script>
<template>
  <n-modal v-model:show="showModal">
    <BrokerageForm :initialValues="brokerage" mode="edit"
                   @delete="handleDelete"
                   @create="handleCreate"
                   @update="handleUpdate"
                   @cancel="handleClose"
    />
  </n-modal>

  <command-list-item
      @edit="handleEdit" @remove="handleRemove" @delete="handleDelete"
      :title="brokerage.name"
      :modelName="ModelName.Ira"
      :tags="[
          {label: brokerage.contributionStrategy, },
          {label: `Growth ${brokerage.growthRate}%`, iconName: 'growthRate', hide: brokerage.growthRate === 0},
      ]"
  >
    <template #summary>
      <span v-if="planStates">

      -${{ $humanize.intComma(annualContribution) }}/year
      </span>
    </template>
  </command-list-item>

</template>