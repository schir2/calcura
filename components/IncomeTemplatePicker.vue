<template>
  <n-thing>
    <IncomeCreateModal
        v-if="isModalOpen && activeIncomeTemplate"
        :incomeTemplate="activeIncomeTemplate"
        @save="handleSaveModal"
        @close="handleCloseModal"
    />
    <template #header>
      Add Income
    </template>
    <n-button round v-if="incomeTemplates" v-for="(incomeTemplate, index) in incomeTemplates" :incomeTemplate="incomeTemplate"
              @click="handleOpenModal(incomeTemplate)"
              :key="incomeTemplate.name">
      <template #icon><Icon name="mdi:cash"></Icon></template>
      {{ incomeTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import type {IncomePartial} from "~/models/income/Income";
import type {IncomeTemplate} from "~/models/income/IncomeTemplate";

const isModalOpen = ref(false);
const activeIncomeTemplate = ref<IncomePartial | null>()
const incomeTemplateService = useIncomeTemplateService()
const incomeTemplates = ref<IncomeTemplate[]>([])

function handleOpenModal(incomeTemplate: IncomeTemplate) {
  activeIncomeTemplate.value = incomeTemplate
  isModalOpen.value = true;
}

async function loadIncomeTemplates() {
  incomeTemplates.value = await incomeTemplateService.list()
}

onMounted(async () => {
  await loadIncomeTemplates()
})

const emit = defineEmits(['save'])

function handleSaveModal(incomeTemplate: IncomeTemplate) {
  emit('save', incomeTemplate)
  isModalOpen.value = false;
}

function handleCloseModal() {
  isModalOpen.value = false
}

</script>