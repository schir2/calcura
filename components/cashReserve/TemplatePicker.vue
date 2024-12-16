<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <CashReserveForm :cashReservePartial="activeCashReservePartial" mode="create"
                @create="handleCreate"
                @cancel="handleClose"
      />
    </n-modal>
    <template #header>
      Add Cash Reserve
    </template>
    <n-button round v-if="cashReserveTemplates" v-for="(cashReserveTemplate, index) in cashReserveTemplates" :cashReserveTemplate="cashReserveTemplate"
              @click="handleOpenModal(cashReserveTemplate)"
              :key="cashReserveTemplate.name">
      <template #icon><Icon name="mdi:cash"></Icon></template>
      {{ cashReserveTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {type CashReserve, cashReserveDefaults, type CashReservePartial} from "~/models/cashReserve/CashReserve";
import type {CashReserveTemplate} from "~/models/cashReserve/CashReserve";
import {useCashReserveTemplateService} from "~/composables/api/useCashReserveTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeCashReservePartial = ref<CashReservePartial | null>()
const cashReserveTemplateService = useCashReserveTemplateService()
const cashReserveTemplates = ref<CashReservePartial[]>([])

function handleOpenModal(cashReserveTemplate: Partial<CashReserve>) {
  activeCashReservePartial.value = cashReserveTemplate
  showModal.value = true;
}

async function loadCashReserveTemplates() {
  const loadedCashReserveTemplates = await cashReserveTemplateService.list()
  cashReserveTemplates.value = loadedCashReserveTemplates.map(cashReserveTemplate => processTemplate<CashReservePartial, CashReserveTemplate, CashReserve>(cashReserveDefaults, cashReserveTemplate));
}

onMounted(async () => {
  await loadCashReserveTemplates()
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