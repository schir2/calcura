<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <BrokerageForm :initialValues="activeBrokeragePartial" mode="create"
                     @create="handleCreate"
                     @cancel="handleClose"
      />
    </n-modal>
    <n-button size="small" type="info" round v-if="templates" v-for="(brokerageTemplate, index) in templates"
              :brokerageTemplate="brokerageTemplate"
              @click="handleOpenModal(brokerageTemplate)"
              :key="brokerageTemplate.name">
      <template #icon>
        <Icon name="mdi:add-circle"></Icon>
      </template>
      {{ brokerageTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import type {Brokerage, BrokerageInsert, BrokerageTemplate} from "#shared/types/Brokerage";
import {brokerageDefaults} from "~~/constants/BrokerageConstants";
import {useBrokerageTemplateService} from "~/composables/api/useBrokerageTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeBrokeragePartial = ref<Partial<Brokerage> | null>()
const templateService = useBrokerageTemplateService()
const templates = ref<Partial<Brokerage>[]>([])

async function loadTemplates() {
  templates.value = [brokerageDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(brokerageTemplate => templates.value.push(processTemplate<Partial<Brokerage>, BrokerageTemplate, Brokerage>(brokerageDefaults, brokerageTemplate)));
  }
}

function handleOpenModal(brokerageTemplate: Partial<Brokerage>) {
  activeBrokeragePartial.value = brokerageTemplate
  showModal.value = true;
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits<{
  create: [insert: BrokerageInsert]
}>()

function handleCreate(brokeragePartial: Partial<Brokerage>) {
  emit('create', brokeragePartial as BrokerageInsert)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

</script>
