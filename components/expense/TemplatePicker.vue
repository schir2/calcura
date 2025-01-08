<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <ExpenseForm :expensePartial="activeExpensePartial" mode="create"
                   @create="handleCreate"
                   @cancel="handleClose"
      />
    </n-modal>
    <n-button size="small" type="warning" round v-if="templates" v-for="(expenseTemplate, index) in templates"
              :expenseTemplate="expenseTemplate"
              @click="handleOpenModal(expenseTemplate)"
              :key="expenseTemplate.name">
      <template #icon>
        <Icon name="mdi:add-circle"></Icon>
      </template>
      {{ expenseTemplate.name }}
    </n-button>
  </n-thing>
</template>
<script lang="ts" setup>
import {type Expense, expenseDefaults, type ExpensePartial, type ExpenseTemplate} from "~/models/expense/Expense";
import {useExpenseTemplateService} from "~/composables/api/useExpenseTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";

const showModal = ref(false);
const activeExpensePartial = ref<ExpensePartial | null>()
const templateService = useExpenseTemplateService()
const templates = ref<ExpensePartial[]>([])

async function loadTemplates() {
  templates.value = [expenseDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(expenseTemplate => templates.value.push(processTemplate<ExpensePartial, ExpenseTemplate, Expense>(expenseDefaults, expenseTemplate)));
  }
}

function handleOpenModal(expenseTemplate: Partial<Expense>) {
  activeExpensePartial.value = expenseTemplate
  showModal.value = true;
}

onMounted(async () => {
  await loadTemplates()
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