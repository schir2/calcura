<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <TaxDeferredInvestmentForm :taxDeferredInvestmentPartial="activeTaxDeferredInvestmentPartial" mode="create"
                                 @create="handleCreate"
                                 @cancel="handleClose"
      />
    </n-modal>
    <n-button size="small" type="info" round v-if="templates"
              v-for="(taxDeferredInvestmentTemplate, index) in templates"
              :taxDeferredInvestmentTemplate="taxDeferredInvestmentTemplate"
              @click="handleOpenModal(taxDeferredInvestmentTemplate)"
              :key="taxDeferredInvestmentTemplate.name">
      <template #icon>
        <Icon name="mdi:cash"></Icon>
      </template>
      {{ taxDeferredInvestmentTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {useTaxDeferredInvestmentTemplateService} from "~/composables/api/useTaxDeferredInvestmentTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";
import {
  type TaxDeferredInvestment,
  taxDeferredInvestmentDefaults,
  type TaxDeferredInvestmentPartial,
  type TaxDeferredInvestmentTemplate
} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";

const showModal = ref(false);
const activeTaxDeferredInvestmentPartial = ref<TaxDeferredInvestmentPartial | null>()
const templateService = useTaxDeferredInvestmentTemplateService()
const templates = ref<TaxDeferredInvestmentPartial[]>([])

function handleOpenModal(taxDeferredInvestmentTemplate: Partial<TaxDeferredInvestment>) {
  activeTaxDeferredInvestmentPartial.value = taxDeferredInvestmentTemplate
  showModal.value = true;
}

async function loadTemplates() {
  templates.value = [taxDeferredInvestmentDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(taxDeferredInvestmentTemplate => templates.value.push(processTemplate<TaxDeferredInvestmentPartial, TaxDeferredInvestmentTemplate, TaxDeferredInvestment>(taxDeferredInvestmentDefaults, taxDeferredInvestmentTemplate)));
  }
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits(['create'])

function handleCreate(taxDeferredInvestmentPartial: Partial<TaxDeferredInvestment>) {
  emit('create', taxDeferredInvestmentPartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false
}

</script>