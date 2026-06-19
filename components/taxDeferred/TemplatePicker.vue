<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <TaxDeferredForm :initialValues="activeTaxDeferredPartial" mode="create"
                                 @create="handleCreate"
                                 @cancel="handleClose"
                                 :incomes="incomes"
      />
    </n-modal>
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
  type TaxDeferredInsert,
  type TaxDeferredTemplate
} from "~/types/TaxDeferred";
import type {Income} from "~/types/Income";

type Props = {
  incomes: undefined | Income[]
}
const props = defineProps<Props>()
const showModal = ref(false);
const activeTaxDeferredPartial = ref<Partial<TaxDeferred> | null>()
const templateService = useTaxDeferredTemplateService()
const templates = ref<Partial<TaxDeferred>[]>([])

function handleOpenModal(taxDeferredTemplate: Partial<TaxDeferred>) {
  activeTaxDeferredPartial.value = taxDeferredTemplate
  showModal.value = true;
}

async function loadTemplates() {
  templates.value = [taxDeferredDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(taxDeferredTemplate => templates.value.push(processTemplate<Partial<TaxDeferred>, TaxDeferredTemplate, TaxDeferred>(taxDeferredDefaults, taxDeferredTemplate)));
  }
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits<{
  create: [insert: TaxDeferredInsert]
}>()

function handleCreate(taxDeferredPartial: Partial<TaxDeferred>) {
  emit('create', taxDeferredPartial as TaxDeferredInsert)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

</script>
