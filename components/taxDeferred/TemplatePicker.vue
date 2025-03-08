<template>
  <n-thing>
    <lazy-n-modal v-model:show="showModal">
      <TaxDeferredForm :initialValues="activeTaxDeferredPartial" mode="create"
                                 @create="handleCreate"
                                 @cancel="handleClose"
                                 :incomes="incomes"
      />
    </lazy-n-modal>
    <n-button size="small" type="info" round v-if="templates"
              v-for="(taxDeferredTemplate, index) in templates"
              :taxDeferredTemplate="taxDeferredTemplate"
              @click="handleOpenModal(taxDeferredTemplate)"
              :key="taxDeferredTemplate.name">
      <template #icon>
        <Icon name="mdi:cash"></Icon>
      </template>
      {{ taxDeferredTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {useTaxDeferredTemplateService} from "~/composables/api/useTaxDeferredTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";
import {
  type TaxDeferred,
  taxDeferredDefaults,
  type TaxDeferredPartial,
  type TaxDeferredTemplate
} from "~/types/TaxDeferred";
import type {Income} from "~/types/Income";

interface Props {
  incomes: undefined | Income[]
}
const props = defineProps<Props>()
const showModal = ref(false);
const activeTaxDeferredPartial = ref<TaxDeferredPartial | null>()
const templateService = useTaxDeferredTemplateService()
const templates = ref<TaxDeferredPartial[]>([])

function handleOpenModal(taxDeferredTemplate: Partial<TaxDeferred>) {
  activeTaxDeferredPartial.value = taxDeferredTemplate
  showModal.value = true;
}

async function loadTemplates() {
  templates.value = [taxDeferredDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(taxDeferredTemplate => templates.value.push(processTemplate<TaxDeferredPartial, TaxDeferredTemplate, TaxDeferred>(taxDeferredDefaults, taxDeferredTemplate)));
  }
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits(['create'])

function handleCreate(taxDeferredPartial: Partial<TaxDeferred>) {
  emit('create', taxDeferredPartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false
}

</script>