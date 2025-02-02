<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <IraInvestmentForm :initialValues="activeIraInvestmentPartial" mode="create"
                               @create="handleCreate"
                               @cancel="handleClose"
      />
    </n-modal>
      <n-button size="small" type="info" round v-if="templates" v-for="(iraInvestmentTemplate, index) in templates" :iraInvestmentTemplate="iraInvestmentTemplate"
                @click="handleOpenModal(iraInvestmentTemplate)"
                :key="iraInvestmentTemplate.name">
        <template #icon>
          <Icon name="mdi:add-circle"></Icon>
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
const templateService = useIraInvestmentTemplateService()
const templates = ref<IraInvestmentPartial[]>([])

async function loadTemplates() {
  const loadedIraInvestmentTemplates = await templateService.list()
  templates.value = loadedIraInvestmentTemplates.map(iraInvestmentTemplate => processTemplate<IraInvestmentPartial, IraInvestmentTemplate, IraInvestment>(iraInvestmentDefaults, iraInvestmentTemplate));
  templates.value.push(iraInvestmentDefaults)
}

function handleOpenModal(iraInvestmentTemplate: Partial<IraInvestment>) {
  activeIraInvestmentPartial.value = iraInvestmentTemplate
  showModal.value = true;
}

onMounted(async () => {
  await loadTemplates()
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