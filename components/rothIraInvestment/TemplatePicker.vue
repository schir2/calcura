<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <RothIraInvestmentForm :rothIraInvestmentPartial="activeRothIraInvestmentPartial" mode="create"
                               @create="handleCreate"
                               @cancel="handleClose"
      />
    </n-modal>
    <template #header>
      Add RothIraInvestment
    </template>
      <n-button round v-if="rothIraInvestmentTemplates" v-for="(rothIraInvestmentTemplate, index) in rothIraInvestmentTemplates" :rothIraInvestmentTemplate="rothIraInvestmentTemplate"
                @click="handleOpenModal(rothIraInvestmentTemplate)"
                :key="rothIraInvestmentTemplate.name">
        <template #icon>
          <Icon name="mdi:cash"></Icon>
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
const rothIraInvestmentTemplateService = useRothIraInvestmentTemplateService()
const rothIraInvestmentTemplates = ref<RothIraInvestmentPartial[]>([])

function handleOpenModal(rothIraInvestmentTemplate: Partial<RothIraInvestment>) {
  activeRothIraInvestmentPartial.value = rothIraInvestmentTemplate
  showModal.value = true;
}

async function loadRothIraInvestmentTemplates() {
  const loadedRothIraInvestmentTemplates = await rothIraInvestmentTemplateService.list()
  rothIraInvestmentTemplates.value = loadedRothIraInvestmentTemplates.map(rothIraInvestmentTemplate => processTemplate<RothIraInvestmentPartial, RothIraInvestmentTemplate, RothIraInvestment>(rothIraInvestmentDefaults, rothIraInvestmentTemplate));
}

onMounted(async () => {
  await loadRothIraInvestmentTemplates()
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