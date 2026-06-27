<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <TaxDeferredCreateForm :initial-values="activeTaxDeferredPartial"
                             @create="handleCreate"
                             @cancel="handleClose"
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
import {processTemplate} from "~/utils/templateProcessorUtils";
import type {TaxDeferred, TaxDeferredInsert, TaxDeferredTemplate} from "#shared/types/TaxDeferred";
import {taxDeferredDefaults} from "~/constants/TaxDeferredConstants";

const showModal = ref(false);
const activeTaxDeferredPartial = ref<Partial<TaxDeferred> | null>()
const taxDeferredTemplateStore = useTaxDeferredTemplateStore()
const templates = computed(() => [taxDeferredDefaults, ...taxDeferredTemplateStore.list.map(t => processTemplate<Partial<TaxDeferred>, TaxDeferredTemplate, TaxDeferred>(taxDeferredDefaults, t))])

function handleOpenModal(taxDeferredTemplate: Partial<TaxDeferred>) {
  activeTaxDeferredPartial.value = taxDeferredTemplate
  showModal.value = true;
}

onMounted(() => {
  taxDeferredTemplateStore.fetchAll()
})

const emit = defineEmits<{
  create: [insert: TaxDeferredInsert]
}>()

function handleCreate(insert: TaxDeferredInsert) {
  emit('create', insert)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

</script>
