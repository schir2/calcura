<script lang="ts" setup>
import type {Plan, PlanInsert, PlanUpdate} from "~/types/Plan";
import {usePlanService} from "~/composables/api/usePlanService";


const planService = usePlanService()
const {data: plans, refresh: refreshPlans} = useAsyncData(() => {
  return planService.list()
})

const showModal = ref(false)

async function handleCreatePlan(insert: PlanInsert) {
  await planService.create(insert)
  await refreshPlans();
}

function handleClickCreatePlan() {
  showModal.value = true
}

async function handleDeletePlan(id: number) {
  await planService.remove(id)
  await refreshPlans();
}

async function handleUpdatePlan(id: number, update: PlanUpdate) {
  await planService.update(id, update)
  await refreshPlans();
}

onMounted(async () => {
  await refreshPlans();
});
</script>

<template>
  <n-button type="primary" circle @click="handleClickCreatePlan">
    <template #icon>
      <icon name="mdi:add"/>
    </template>
  </n-button>
  <n-modal
      v-model:show="showModal"
      class="max-w-6xl"
  >
    <template #header>
      <h3 class="text-2xl mb-2">
        <base-ico name="plan"/>
        Create New Plan
      </h3>
    </template>
    <plan-form
        @create="handleCreatePlan"
        @update="handleUpdatePlan"
        @cancel="showModal = false"
    />


  </n-modal>
  <PlanList
      :plans="plans ?? []"
      @duplicate="handleCreatePlan"
      @update="handleUpdatePlan"
      @delete="handleDeletePlan"
  ></PlanList>
</template>