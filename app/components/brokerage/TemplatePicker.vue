<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <BrokerageCreateForm :initial-values="activeBrokeragePartial"
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
import {brokerageDefaults} from "~/constants/BrokerageConstants";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeBrokeragePartial = ref<Partial<Brokerage> | null>()
const brokerageTemplateStore = useBrokerageTemplateStore()
const templates = computed(() => [brokerageDefaults, ...brokerageTemplateStore.list.map(t => processTemplate<Partial<Brokerage>, BrokerageTemplate, Brokerage>(brokerageDefaults, t))])

function handleOpenModal(brokerageTemplate: Partial<Brokerage>) {
  activeBrokeragePartial.value = brokerageTemplate
  showModal.value = true;
}

onMounted(() => {
  brokerageTemplateStore.fetchAll()
})

const emit = defineEmits<{
  create: [insert: BrokerageInsert]
}>()

function handleCreate(insert: BrokerageInsert) {
  emit('create', insert)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

</script>
