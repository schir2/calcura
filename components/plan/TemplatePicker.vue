<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <PlanForm :planPartial="activePlanPartial" mode="create"
                @create="handleCreate"
                @cancel="handleClose"
      />
    </n-modal>
    <template #header>
      Add Plan
    </template>
    <n-button round v-if="planTemplates" v-for="(planTemplate, index) in planTemplates" :planTemplate="planTemplate"
              @click="handleOpenModal(planTemplate)"
              :key="planTemplate.name">
      <template #icon>
        <Icon name="mdi:cash"></Icon>
      </template>
      {{ planTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {type Plan, planDefaults, type PlanPartial} from "~/models/plan/Plan";
import type {PlanTemplate} from "~/models/plan/PlanTemplate";
import {usePlanTemplateService} from "~/composables/api/usePlanTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activePlanPartial = ref<PlanPartial | null>()
const planTemplateService = usePlanTemplateService()
const planTemplates = ref<PlanPartial[]>([])

function handleOpenModal(planTemplate: Partial<Plan>) {
  activePlanPartial.value = planTemplate
  showModal.value = true;
}

async function loadPlanTemplates() {
  const loadedPlanTemplates = await planTemplateService.list()
  planTemplates.value = loadedPlanTemplates.map(planTemplate => processTemplate<PlanPartial, PlanTemplate, Plan>(planDefaults, planTemplate));
  planTemplates.value.push(planDefaults)
  planTemplates.value =[planDefaults]
  console.log(planTemplates)
}

onMounted(async () => {
  await loadPlanTemplates()
})

const emit = defineEmits(['create'])

function handleCreate(planPartial: Partial<Plan>) {
  emit('create', planPartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false
}

</script>