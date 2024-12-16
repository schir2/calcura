<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <IraInvestmentForm :iraInvestmentPartial="activeIraInvestmentPartial" mode="create"
                               @create="handleCreate"
                               @cancel="handleClose"
      />
    </n-modal>
    <template #header>
      Add IraInvestment
    </template>
      <n-button round v-if="iraInvestmentTemplates" v-for="(iraInvestmentTemplate, index) in iraInvestmentTemplates" :iraInvestmentTemplate="iraInvestmentTemplate"
                @click="handleOpenModal(iraInvestmentTemplate)"
                :key="iraInvestmentTemplate.name">
        <template #icon>
          <Icon name="mdi:cash"></Icon>
        </template>
        {{ iraInvestmentTemplate.name }}
      </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import type {IraInvestmentTemplate} from "~/models/iraInvestment/IraInvestment";
import {type IraInvestment, iraInvestmentDefaults, type IraInvestmentPartial} from "~/models/iraInvestment/IraInvestment";
import {useIraInvestmentTemplateService} from "~/composables/api/useIraInvestmentTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeIraInvestmentPartial = ref<IraInvestmentPartial | null>()
const iraInvestmentTemplateService = useIraInvestmentTemplateService()
const iraInvestmentTemplates = ref<IraInvestmentPartial[]>([])

function handleOpenModal(iraInvestmentTemplate: Partial<IraInvestment>) {
  activeIraInvestmentPartial.value = iraInvestmentTemplate
  showModal.value = true;
}

async function loadIraInvestmentTemplates() {
  const loadedIraInvestmentTemplates = await iraInvestmentTemplateService.list()
  iraInvestmentTemplates.value = loadedIraInvestmentTemplates.map(iraInvestmentTemplate => processTemplate<IraInvestmentPartial, IraInvestmentTemplate, IraInvestment>(iraInvestmentDefaults, iraInvestmentTemplate));
}

onMounted(async () => {
  await loadIraInvestmentTemplates()
})

const emit = defineEmits(['create'])

function handleCreate(iraInvestmentPartial: Partial<IraInvestment>) {
  emit('create', iraInvestmentPartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false
}

</script>