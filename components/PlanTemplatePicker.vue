<template>
  <n-thing>
    <PlanCreateModal
        v-if="isModalOpen && activePlanTemplate"
        :planTemplate="activePlanTemplate"
        @save="handleSaveModal"
        @close="handleCloseModal"
    />
    <template #header>
      Add Plan
    </template>
    <n-button round v-if="planTemplates" v-for="(planTemplate, index) in planTemplates" :planTemplate="planTemplate"
              @click="handleOpenModal(planTemplate)"
              :key="planTemplate.name">
      <template #icon><Icon name="mdi:cash"></Icon></template>
      {{ planTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import type {PlanPartial} from "~/models/plan/Plan";
import type {PlanTemplate} from "~/models/plan/PlanTemplate";
import {usePlanTemplateService} from "~/composables/usePlanTemplateService";

const isModalOpen = ref(false);
const activePlanTemplate = ref<PlanPartial | null>()
const planTemplateService = usePlanTemplateService()
const planTemplates = ref<PlanTemplate[]>([])

function handleOpenModal(planTemplate: PlanTemplate) {
  activePlanTemplate.value = planTemplate
  isModalOpen.value = true;
}

async function loadPlanTemplates() {
  planTemplates.value = await planTemplateService.list()
}

onMounted(async () => {
  await loadPlanTemplates()
})

const emit = defineEmits(['save'])

function handleSaveModal(planTemplate: PlanTemplate) {
  emit('save', planTemplate)
  isModalOpen.value = false;
}

function handleCloseModal() {
  isModalOpen.value = false
}

</script>