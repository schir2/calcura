<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <CashReserveForm :cashReservePartial="activeCashReservePartial" mode="create"
                       @create="handleCreate"
                       @cancel="handleClose"
      />
    </n-modal>
    <n-button size="small" type="info" round v-if="templates" v-for="(cashReserveTemplate, index) in templates"
              :cashReserveTemplate="cashReserveTemplate"
              @click="handleOpenModal(cashReserveTemplate)"
              :key="cashReserveTemplate.name">
      <template #icon>
        <Icon name="mdi:add-circle"></Icon>
      </template>
      {{ cashReserveTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {
  type CashReserve,
  cashReserveDefaults,
  type CashReservePartial,
  type CashReserveTemplate
} from "~/models/cashReserve/CashReserve";
import {useCashReserveTemplateService} from "~/composables/api/useCashReserveTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeCashReservePartial = ref<CashReservePartial | null>()
const templateService = useCashReserveTemplateService()
const templates = ref<CashReservePartial[]>([])

async function loadTemplates() {
  templates.value = [cashReserveDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(cashReserveTemplate => templates.value.push(processTemplate<CashReservePartial, CashReserveTemplate, CashReserve>(cashReserveDefaults, cashReserveTemplate)));
  }
}

function handleOpenModal(cashReserveTemplate: Partial<CashReserve>) {
  activeCashReservePartial.value = cashReserveTemplate
  showModal.value = true;
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits(['create'])

function handleCreate(cashReservePartial: Partial<CashReserve>) {
  emit('create', cashReservePartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false
}

</script>