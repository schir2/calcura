<script lang="ts" setup>
import {type Debt, type DebtInsert, type DebtTemplate} from "#shared/types/Debt";
import {useDebtTemplateService} from "~/composables/api/useDebtTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";
import {debtDefaults} from "~~/constants/DebtConstants";


const showModal = ref(false);
const activeDebtPartial = ref<Partial<Debt> | null>()
const templateService = useDebtTemplateService()
const templates = ref<Partial<Debt>[]>([])

async function loadTemplates() {
  templates.value = [debtDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(debtTemplate => templates.value.push(processTemplate<Partial<Debt>, DebtTemplate, Debt>(debtDefaults, debtTemplate)));
  }
}

function handleOpenModal(debtTemplate: Partial<Debt>) {
  activeDebtPartial.value = debtTemplate
  showModal.value = true;
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits<{
  create: [insert: DebtInsert]
}>()

function handleCreate(debtPartial: Partial<Debt>) {
  emit('create', debtPartial as DebtInsert)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

</script>

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
