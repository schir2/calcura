<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <ExpenseForm :expensePartial="activeExpensePartial" mode="create"
                @create="handleCreate"
                @cancel="handleClose"
      />
    </n-modal>
    <n-button round v-if="expenseTemplates" v-for="(expenseTemplate, index) in expenseTemplates" :expenseTemplate="expenseTemplate"
              @click="handleOpenModal(expenseTemplate)"
              :key="expenseTemplate.name">
      <template #icon><Icon name="mdi:cash"></Icon></template>
      {{ expenseTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {type Expense, expenseDefaults, type ExpensePartial} from "~/models/expense/Expense";
import type {ExpenseTemplate} from "~/models/expense/Expense";
import {useExpenseTemplateService} from "~/composables/api/useExpenseTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeExpensePartial = ref<ExpensePartial | null>()
const expenseTemplateService = useExpenseTemplateService()
const expenseTemplates = ref<ExpensePartial[]>([])

function handleOpenModal(expenseTemplate: Partial<Expense>) {
  activeExpensePartial.value = expenseTemplate
  showModal.value = true;
}

async function loadExpenseTemplates() {
  const loadedExpenseTemplates = await expenseTemplateService.list()
  expenseTemplates.value = loadedExpenseTemplates.map(expenseTemplate => processTemplate<ExpensePartial, ExpenseTemplate, Expense>(expenseDefaults, expenseTemplate));
}

onMounted(async () => {
  await loadExpenseTemplates()
})

const emit = defineEmits(['create'])

function handleCreate(expensePartial: Partial<Expense>) {
  emit('create', expensePartial)
  showModal.value = false;
}

function handleClose() {
  showModal.value = false
}

</script>