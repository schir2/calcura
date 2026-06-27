<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <IncomeCreateForm :initial-values="activeIncomePartial"
                        @create="handleCreate"
                        @cancel="handleClose"
      />
    </n-modal>
    <n-button type="success" size="small" round v-if="templates" v-for="(incomeTemplate, index) in templates"
              :incomeTemplate="incomeTemplate"
              @click="handleOpenModal(incomeTemplate)"
              :key="incomeTemplate.name">
      <template #icon>
        <Icon name="mdi:add-circle"></Icon>
      </template>
      {{ incomeTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {processTemplate} from "~/utils/templateProcessorUtils";
import type {Income, IncomeInsert, IncomeTemplate} from "#shared/types/Income";
import {incomeDefaults} from "~/constants/IncomeConstants";

const showModal = ref(false);
const activeIncomePartial = ref<Partial<Income> | null>()
const incomeTemplateStore = useIncomeTemplateStore()
const templates = computed(() => [incomeDefaults, ...incomeTemplateStore.list.map(t => processTemplate<Partial<Income>, IncomeTemplate, Income>(incomeDefaults, t))])

function handleOpenModal(incomeTemplate: Partial<Income>) {
  activeIncomePartial.value = incomeTemplate
  showModal.value = true;
}

onMounted(() => {
  incomeTemplateStore.fetchAll()
})

const emit = defineEmits<{
  create: [insert: IncomeInsert]
}>()

function handleCreate(insert: IncomeInsert) {
  emit('create', insert)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

</script>
