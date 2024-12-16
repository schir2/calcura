<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <BrokerageInvestmentForm :brokerageInvestmentPartial="activeBrokerageInvestmentPartial" mode="create"
                               @create="handleCreate"
                               @cancel="handleClose"
      />
    </n-modal>
    <template #header>
      Add BrokerageInvestment
    </template>
      <n-button round v-if="brokerageInvestmentTemplates" v-for="(brokerageInvestmentTemplate, index) in brokerageInvestmentTemplates" :brokerageInvestmentTemplate="brokerageInvestmentTemplate"
                @click="handleOpenModal(brokerageInvestmentTemplate)"
                :key="brokerageInvestmentTemplate.name">
        <template #icon>
          <Icon name="mdi:cash"></Icon>
        </template>
        {{ brokerageInvestmentTemplate.name }}
      </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import type {BrokerageInvestmentTemplate} from "~/models/brokerageInvestment/BrokerageInvestment";
import {type BrokerageInvestment, brokerageInvestmentDefaults, type BrokerageInvestmentPartial} from "~/models/brokerageInvestment/BrokerageInvestment";
import {useBrokerageInvestmentTemplateService} from "~/composables/api/useBrokerageInvestmentTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeBrokerageInvestmentPartial = ref<BrokerageInvestmentPartial | null>()
const brokerageInvestmentTemplateService = useBrokerageInvestmentTemplateService()
const brokerageInvestmentTemplates = ref<BrokerageInvestmentPartial[]>([])

function handleOpenModal(brokerageInvestmentTemplate: Partial<BrokerageInvestment>) {
  activeBrokerageInvestmentPartial.value = brokerageInvestmentTemplate
  showModal.value = true;
}

async function loadBrokerageInvestmentTemplates() {
  const loadedBrokerageInvestmentTemplates = await brokerageInvestmentTemplateService.list()
  brokerageInvestmentTemplates.value = loadedBrokerageInvestmentTemplates.map(brokerageInvestmentTemplate => processTemplate<BrokerageInvestmentPartial, BrokerageInvestmentTemplate, BrokerageInvestment>(brokerageInvestmentDefaults, brokerageInvestmentTemplate));
}

onMounted(async () => {
  await loadBrokerageInvestmentTemplates()
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