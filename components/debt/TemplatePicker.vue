<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <DebtForm :initialValues="activeDebtPartial" mode="create"
                @create="handleCreate"
                @cancel="handleClose"
      />
    </n-modal>
    <n-button size="small" type="error" round v-if="templates" v-for="(debtTemplate, index) in templates"
              :debtTemplate="debtTemplate"
              @click="handleOpenModal(debtTemplate)"
              :key="debtTemplate.name">
      <template #icon>
        <Icon name="mdi:add-circle"></Icon>
      </template>
      {{ debtTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {type Debt, debtDefaults, type DebtPartial, type DebtTemplate} from "~/types/Debt";
import {useDebtTemplateService} from "~/composables/api/useDebtTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";


const showModal = ref(false);
const activeDebtPartial = ref<DebtPartial | null>()
const templateService = useDebtTemplateService()
const templates = ref<DebtPartial[]>([])

async function loadTemplates() {
  templates.value = [debtDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(debtTemplate => templates.value.push(processTemplate<DebtPartial, DebtTemplate, Debt>(debtDefaults, debtTemplate)));
  }
}

function handleOpenModal(debtTemplate: Partial<Debt>) {
  activeDebtPartial.value = debtTemplate
  showModal.value = true;
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits(['create'])

function handleCreate(debtPartial: Partial<Debt>) {
  emit('create', debtPartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false
}

</script>