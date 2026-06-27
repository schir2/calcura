<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <CashReserveCreateForm :initial-values="activeCashReservePartial"
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
  type CashReserveInsert,
  type CashReserveTemplate
} from "#shared/types/CashReserve";
import {processTemplate} from "~/utils/templateProcessorUtils";
import {cashReserveDefaults} from "~/constants/CashReserveConstants";

const showModal = ref(false);
const activeCashReservePartial = ref<Partial<CashReserve> | null>()
const cashReserveTemplateStore = useCashReserveTemplateStore()
const templates = computed(() => [cashReserveDefaults, ...cashReserveTemplateStore.list.map(t => processTemplate<Partial<CashReserve>, CashReserveTemplate, CashReserve>(cashReserveDefaults, t))])

function handleOpenModal(cashReserveTemplate: Partial<CashReserve>) {
  activeCashReservePartial.value = cashReserveTemplate
  showModal.value = true;
}

onMounted(() => {
  cashReserveTemplateStore.fetchAll()
})

const emit = defineEmits<{
  create: [insert: CashReserveInsert]
}>()

function handleCreate(insert: CashReserveInsert) {
  emit('create', insert)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

</script>
