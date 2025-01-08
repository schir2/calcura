<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <BrokerageInvestmentForm :brokerageInvestmentPartial="activeBrokerageInvestmentPartial" mode="create"
                               @create="handleCreate"
                               @cancel="handleClose"
      />
    </n-modal>
    <n-button size="small" type="info" round v-if="templates" v-for="(brokerageInvestmentTemplate, index) in templates"
              :brokerageInvestmentTemplate="brokerageInvestmentTemplate"
              @click="handleOpenModal(brokerageInvestmentTemplate)"
              :key="brokerageInvestmentTemplate.name">
      <template #icon>
        <Icon name="mdi:add-circle"></Icon>
      </template>
      {{ brokerageInvestmentTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {
  type BrokerageInvestment,
  brokerageInvestmentDefaults,
  type BrokerageInvestmentPartial,
  type BrokerageInvestmentTemplate
} from "~/models/brokerageInvestment/BrokerageInvestment";
import {useBrokerageInvestmentTemplateService} from "~/composables/api/useBrokerageInvestmentTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeBrokerageInvestmentPartial = ref<BrokerageInvestmentPartial | null>()
const templateService = useBrokerageInvestmentTemplateService()
const templates = ref<BrokerageInvestmentPartial[]>([])

async function loadTemplates() {
  templates.value = [brokerageInvestmentDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(brokerageInvestmentTemplate => templates.value.push(processTemplate<BrokerageInvestmentPartial, BrokerageInvestmentTemplate, BrokerageInvestment>(brokerageInvestmentDefaults, brokerageInvestmentTemplate)));
  }
}

function handleOpenModal(brokerageInvestmentTemplate: Partial<BrokerageInvestment>) {
  activeBrokerageInvestmentPartial.value = brokerageInvestmentTemplate
  showModal.value = true;
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits(['create'])

function handleCreate(brokerageInvestmentPartial: Partial<BrokerageInvestment>) {
  emit('create', brokerageInvestmentPartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false
}

</script>