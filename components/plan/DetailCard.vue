<script setup lang="ts">

import type {Plan} from "~/types/Plan";

type Props = {
  plan: Plan
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)
const showDetail = ref<boolean>(false)

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
<template>

  <n-modal v-model:show="showModal">
    <PlanForm :initialValues="plan" mode="edit"
              @delete="handleDelete"
              @create="handleCreate"
              @update="handleUpdate"
              @cancel="handleClose"
    />
  </n-modal>
  <n-card size="small">
    <template #header>
      <div class="flex items-center justify-start gap-2">
        <Icon class="text-2xl" name="mdi:flower-poppy"/>
        <span class="text-2xl">Plan: {{ plan.name }}</span>
        <n-button @click="showDetail=false" v-if="showDetail" type="info" quaternary>
          <template #icon><base-ico name="up"/></template>
          Hide Detail</n-button>
        <n-button @click="showDetail=true" v-else type="info" quaternary>
          <template #icon><base-ico name="down"/></template>
          Show Detail</n-button>
      </div>
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

    <n-collapse-transition :show="showDetail">
      <section id="planInfo" class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
        <n-card size="small">
          <template #header>Profile</template>
          <p class="flex justify-between"><span>Year </span><span>{{ plan.year }}</span></p>
          <p class="flex justify-between"><span>Age</span><span>{{ plan.age }}</span></p>
          <p class="flex justify-between"><span>Retirement Age </span><span>{{ plan.retirement_age }}</span></p>
          <p class="flex justify-between"><span>Life Expectancy </span><span>{{ plan.life_expectancy }}</span></p>
        </n-card>
        <n-card size="small">
          <template #header>Rates/Settings</template>
          <p class="flex justify-between"><span>Inflation Rate </span><span>{{ plan.inflation_rate }}</span></p>
          <p class="flex justify-between"><span>Tax Rate </span><span>{{ plan.tax_rate }}</span></p>
          <p class="flex justify-between">
            <span>Insufficient Funds Strategy </span><span>{{ plan.insufficient_funds_strategy }}</span></p>
          <p class="flex justify-between">
            <span>Growth Strategy</span><span>{{ plan.growth_application_strategy }}</span></p>
        </n-card>
        <n-card size="small">
          <template #header>Retirement</template>
          <p class="flex justify-between"><span>Retirement Strategy </span><span>{{
              plan.retirement_strategy
            }}</span></p>
          <p class="flex justify-between">
            <span>Withdrawal Rate </span><span>{{ plan.retirement_withdrawal_rate }}%</span></p>
          <p class="flex justify-between"><span>Income Goal </span><span>${{
              $humanize.intComma(plan.retirement_income_goal)
            }}</span></p>
          <p class="flex justify-between">
            <span>Retirement Savings Amount</span><span>${{ $humanize.intComma(plan.retirement_savings_amount) }}</span>
          </p>
        </n-card>
      </section>
    </n-collapse-transition>
  </n-card>
</template>