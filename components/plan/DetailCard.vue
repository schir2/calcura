<template>

  <n-modal v-model:show="showModal">
    <PlanForm :initialValues="plan" mode="edit"
              @delete="handleDelete"
              @create="handleCreate"
              @update="handleUpdate"
              @cancel="handleClose"
    />
  </n-modal>
  <n-card>
    <template #header>
      <h1 class="text-2xl">
        <Icon name="mdi:flower-poppy"/>
        Plan {{ plan.id }}: {{ plan.name }}
      </h1>
    </template>
    <template #header-extra>
      <n-button-group size="small">
        <n-button type="warning" secondary round @click="handleEdit">
          <template #icon>
            <Icon name="mdi:edit"/>
          </template>
          Edit
        </n-button>
        <n-button type="error" secondary round @click="handleDelete">
          <template #icon>
            <Icon name="mdi:delete"/>
          </template>
          Delete
        </n-button>
      </n-button-group>
    </template>

    <section id="planInfo" class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-2">
      <n-card>
        <p class="flex justify-between px-3"><span>Name</span><span>{{ plan.name }}</span></p>
        <p class="flex justify-between px-3"><span>Year </span><span>{{ plan.year }}</span></p>
        <p class="flex justify-between px-3"><span>Age</span><span>{{ plan.age }}</span></p>
        <p class="flex justify-between px-3"><span>Retirement Age </span><span>{{ plan.retirementAge }}</span></p>
        <p class="flex justify-between px-3"><span>Life Expectancy </span><span>{{ plan.lifeExpectancy }}</span></p>
      </n-card>
      <n-card>
        <p class="flex justify-between px-3"><span>Inflation Rate </span><span>{{ plan.inflationRate }}</span></p>
        <p class="flex justify-between px-3"><span>Growth Rate </span><span>{{ plan.growthRate }}</span></p>
        <p class="flex justify-between px-3">
          <span>Growth Application Strategy </span><span>{{ plan.growthApplicationStrategy }}</span></p>
      </n-card>
      <n-card>
        <p class="flex justify-between px-3"><span>Tax Strategy </span><span>{{ plan.taxStrategy }}</span></p>
        <p class="flex justify-between px-3"><span>Tax Rate </span><span>{{ plan.taxRate }}</span></p>
        <p class="flex justify-between px-3">
          <span>Insufficient Funds Strategy </span><span>{{ plan.insufficientFundsStrategy }}</span></p>
        </n-card>
      <n-card>
        <p class="flex justify-between px-3"><span>Retirement Strategy </span><span>{{
            plan.retirementStrategy
          }}</span></p>
        <p class="flex justify-between px-3">
          <span>RetirementWithdrawalRate </span><span>{{ plan.retirementWithdrawalRate }}</span></p>
        <p class="flex justify-between px-3"><span>RetirementIncomeGoal </span><span>${{
            $humanize.intComma(plan.retirementIncomeGoal)
          }}</span></p>
        <p class="flex justify-between px-3">
          <span>Retirement Savings Amount</span><span>${{ $humanize.intComma(plan.retirementSavingsAmount) }}</span></p>
      </n-card>
    </section>
  </n-card>
</template>
<script setup lang="ts">

import type {Plan} from "~/types/Plan";

interface Props {
  plan: Plan
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)

const emit = defineEmits(['delete', 'update', 'create']);

function handleDelete() {
  emit('delete', props.plan);
}

function handleUpdate(plan: Partial<Plan>) {
  emit('update', plan)
  showModal.value = false;
}


function handleCreate(planPartial: Partial<Plan>) {
  emit('create', planPartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false;
}

function handleEdit() {
  showModal.value = true;
}
</script>