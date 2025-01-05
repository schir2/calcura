<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <IncomeForm :incomePartial="activeIncomePartial" mode="create"
                @create="handleCreate"
                @cancel="handleClose"
      />
    </n-modal>
    <n-button type="success" size="small" round v-if="incomeTemplates" v-for="(incomeTemplate, index) in incomeTemplates" :incomeTemplate="incomeTemplate"
              @click="handleOpenModal(incomeTemplate)"
              :key="incomeTemplate.name">
      <template #icon><Icon name="mdi:add-circle"></Icon></template>
      {{ incomeTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {type Income, incomeDefaults, type IncomePartial} from "~/models/income/Income";
import type {IncomeTemplate} from "~/models/income/IncomeTemplate";
import {useIncomeTemplateService} from "~/composables/api/useIncomeTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeIncomePartial = ref<IncomePartial | null>()
const incomeTemplateService = useIncomeTemplateService()
const incomeTemplates = ref<IncomePartial[]>([])

function handleOpenModal(incomeTemplate: Partial<Income>) {
  activeIncomePartial.value = incomeTemplate
  showModal.value = true;
}

async function loadIncomeTemplates() {
  const loadedIncomeTemplates = await incomeTemplateService.list()
  incomeTemplates.value = loadedIncomeTemplates.map(incomeTemplate => processTemplate<IncomePartial, IncomeTemplate, Income>(incomeDefaults, incomeTemplate));
}

onMounted(async () => {
  await loadIncomeTemplates()
})

const emit = defineEmits(['create'])

function handleCreate(incomePartial: Partial<Income>) {
  emit('create', incomePartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false
}

</script>