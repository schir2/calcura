<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <DebtForm :debtPartial="activeDebtPartial" mode="create"
                @create="handleCreate"
                @cancel="handleClose"
      />
    </n-modal>
    <template #header>
      Add Debt
    </template>
    <n-button round v-if="debtTemplates" v-for="(debtTemplate, index) in debtTemplates" :debtTemplate="debtTemplate"
              @click="handleOpenModal(debtTemplate)"
              :key="debtTemplate.name">
      <template #icon><Icon name="mdi:cash"></Icon></template>
      {{ debtTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {type Debt, debtDefaults, type DebtPartial} from "~/models/debt/Debt";
import type {DebtTemplate} from "~/models/debt/Debt";
import {useDebtTemplateService} from "~/composables/api/useDebtTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeDebtPartial = ref<DebtPartial | null>()
const debtTemplateService = useDebtTemplateService()
const debtTemplates = ref<DebtPartial[]>([])

function handleOpenModal(debtTemplate: Partial<Debt>) {
  activeDebtPartial.value = debtTemplate
  showModal.value = true;
}

async function loadDebtTemplates() {
  const loadedDebtTemplates = await debtTemplateService.list()
  debtTemplates.value = loadedDebtTemplates.map(debtTemplate => processTemplate<DebtPartial, DebtTemplate, Debt>(debtDefaults, debtTemplate));
}

onMounted(async () => {
  await loadDebtTemplates()
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