<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <TaxDeferredInvestmentForm :taxDeferredInvestmentPartial="activeTaxDeferredInvestmentPartial" mode="create"
                                 @create="handleCreate"
                                 @cancel="handleClose"
      />
    </n-modal>
    <n-button size="small" type="info" round v-if="taxDeferredInvestmentTemplates" v-for="(taxDeferredInvestmentTemplate, index) in taxDeferredInvestmentTemplates" :taxDeferredInvestmentTemplate="taxDeferredInvestmentTemplate"
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
import type {TaxDeferredInvestmentTemplate} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import {type TaxDeferredInvestment, taxDeferredInvestmentDefaults, type TaxDeferredInvestmentPartial} from "~/models/taxDeferredInvestment/TaxDeferredInvestment";
import {useTaxDeferredInvestmentTemplateService} from "~/composables/api/useTaxDeferredInvestmentTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeTaxDeferredInvestmentPartial = ref<TaxDeferredInvestmentPartial | null>()
const taxDeferredInvestmentTemplateService = useTaxDeferredInvestmentTemplateService()
const taxDeferredInvestmentTemplates = ref<TaxDeferredInvestmentPartial[]>([])

function handleOpenModal(taxDeferredInvestmentTemplate: Partial<TaxDeferredInvestment>) {
  activeTaxDeferredInvestmentPartial.value = taxDeferredInvestmentTemplate
  showModal.value = true;
}

async function loadTaxDeferredInvestmentTemplates() {
  const loadedTaxDeferredInvestmentTemplates = await taxDeferredInvestmentTemplateService.list()
  taxDeferredInvestmentTemplates.value = loadedTaxDeferredInvestmentTemplates.map(taxDeferredInvestmentTemplate => processTemplate<TaxDeferredInvestmentPartial, TaxDeferredInvestmentTemplate, TaxDeferredInvestment>(taxDeferredInvestmentDefaults, taxDeferredInvestmentTemplate));
}

onMounted(async () => {
  await loadTaxDeferredInvestmentTemplates()
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