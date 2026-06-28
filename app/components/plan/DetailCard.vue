<script setup lang="ts">

import type {Plan, PlanUpdate} from "#shared/types/Plan";

type Props = {
  plan: Plan
}

const props = defineProps<Props>()

const showModal = ref<boolean>(false)
const showDetail = ref<boolean>(false)
const showDeletePopConfirm = ref<boolean>(false)

const emit = defineEmits<{
  update: [id: number, update: PlanUpdate]
  delete: [id: number]
}>()

function handleDelete() {
  showDeletePopConfirm.value = false
  emit('delete', props.plan.id)
}

function handleUpdate(id: number, update: PlanUpdate) {
  emit('update', id, update)
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
    <PlanUpdateForm :id="plan.id" @update="handleUpdate" @cancel="handleClose" />
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
        <n-popconfirm v-model:show="showDeletePopConfirm">
          <template #icon>
            <Icon class="text-6xl text-skin-error" name="mdi:delete"/>
          </template>
          <template #action>
            <n-button tertiary round @click="showDeletePopConfirm=false">Cancel</n-button>
            <n-button tertiary type="error" round @click="handleDelete">
              <template #icon><Icon name="mdi:delete"/></template>
              Delete
            </n-button>
          </template>
          <template #trigger>
            <n-button type="error" secondary round>
              <template #icon>
                <Icon name="mdi:delete"/>
              </template>
              Delete
            </n-button>
          </template>
          <div class="max-w-md px-3 pe-3">
            <h2 class="text-xl my-3 text-skin-error font-semibold">Delete Plan</h2>
            <p>Are you sure you want to delete this plan?</p>
            <p class="text-skin-info text-xs mb-2">This will permanently remove the plan and all associated data.</p>
          </div>
        </n-popconfirm>
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