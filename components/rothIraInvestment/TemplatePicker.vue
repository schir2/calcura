<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <RothIraInvestmentForm :initialValues="activeRothIraInvestmentPartial" mode="create"
                               @create="handleCreate"
                               @cancel="handleClose"
      />
    </n-modal>
      <n-button size="small" type="info" round v-if="templates" v-for="(rothIraInvestmentTemplate, index) in templates" :rothIraInvestmentTemplate="rothIraInvestmentTemplate"
                @click="handleOpenModal(rothIraInvestmentTemplate)"
                :key="rothIraInvestmentTemplate.name">
        <template #icon>
          <Icon name="mdi:add-circle"></Icon>
        </template>
        {{ rothIraInvestmentTemplate.name }}
      </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import type {RothIraInvestmentTemplate} from "~/models/rothIraInvestment/RothIraInvestment";
import {type RothIraInvestment, rothIraInvestmentDefaults, type RothIraInvestmentPartial} from "~/models/rothIraInvestment/RothIraInvestment";
import {useRothIraInvestmentTemplateService} from "~/composables/api/useRothIraInvestmentTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeRothIraInvestmentPartial = ref<RothIraInvestmentPartial | null>()
const templateService = useRothIraInvestmentTemplateService()
const templates = ref<RothIraInvestmentPartial[]>([])

async function loadTemplates() {
  templates.value =[rothIraInvestmentDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(rothIraInvestmentTemplate => templates.value.push(processTemplate<RothIraInvestmentPartial, RothIraInvestmentTemplate, RothIraInvestment>(rothIraInvestmentDefaults, rothIraInvestmentTemplate)));
  }
}

function handleOpenModal(rothIraInvestmentTemplate: Partial<RothIraInvestment>) {
  activeRothIraInvestmentPartial.value = rothIraInvestmentTemplate
  showModal.value = true;
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits(['create'])

function handleCreate(rothIraInvestmentPartial: Partial<RothIraInvestment>) {
  emit('create', rothIraInvestmentPartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false
}

</script>