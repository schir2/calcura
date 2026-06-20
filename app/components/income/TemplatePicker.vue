<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <IncomeForm :initialValues="activeIncomePartial" mode="create"
                  @create="handleCreate"
                  @cancel="handleClose"
      />
    </n-modal>
    <n-button type="success" size="small" round v-if="templates" v-for="(incomeTemplate, index) in templates"
              :incomeTemplate="incomeTemplate"
              @click="handleOpenModal(incomeTemplate)"
              :key="incomeTemplate.name">
      <template #icon>
        <Icon name="mdi:add-circle"></Icon>
      </template>
      {{ incomeTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {processTemplate} from "~/utils/templateProcessorUtils";
import {useIncomeTemplateService} from "~/composables/api/useIncomeTemplateService";
import type {Income, IncomeInsert, IncomeTemplate} from "#shared/types/Income";
import {incomeDefaults} from "~/constants/IncomeConstants";

const showModal = ref(false);
const activeIncomePartial = ref<Partial<Income> | null>()
const templateService = useIncomeTemplateService()
const templates = ref<Partial<Income>[]>([])

function handleOpenModal(incomeTemplate: Partial<Income>) {
  activeIncomePartial.value = incomeTemplate
  showModal.value = true;
}

async function loadTemplates() {
  templates.value = [incomeDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(incomeTemplate => templates.value.push(processTemplate<Partial<Income>, IncomeTemplate, Income>(incomeDefaults, incomeTemplate)));
  }
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits<{
  create: [insert: IncomeInsert]
}>()

function handleCreate(incomePartial: Partial<Income>) {
  emit('create', incomePartial as IncomeInsert)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

</script>
