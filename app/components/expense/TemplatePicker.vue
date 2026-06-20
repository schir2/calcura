<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <ExpenseForm :initialValues="activeExpensePartial" mode="create"
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
import type {Expense, ExpenseInsert, ExpenseTemplate} from "#shared/types/Expense";
import {useExpenseTemplateService} from "~/composables/api/useExpenseTemplateService";
import {processTemplate} from "~/utils/templateProcessorUtils";
import {expenseDefaults} from "~/constants/ExpenseConstants";

const showModal = ref(false);
const activeExpensePartial = ref<Partial<Expense> | null>()
const templateService = useExpenseTemplateService()
const templates = ref<Partial<Expense>[]>([])

async function loadTemplates() {
  templates.value = [expenseDefaults]
  const loadedTemplates = await templateService.list()
  if (loadedTemplates.length > 0) {
    loadedTemplates.forEach(expenseTemplate => templates.value.push(processTemplate<Partial<Expense>, ExpenseTemplate, Expense>(expenseDefaults, expenseTemplate)));
  }
}

function handleOpenModal(expenseTemplate: Partial<Expense>) {
  activeExpensePartial.value = expenseTemplate
  showModal.value = true;
}

onMounted(async () => {
  await loadTemplates()
})

const emit = defineEmits<{
  create: [insert: ExpenseInsert]
}>()

function handleCreate(expensePartial: Partial<Expense>) {
  emit('create', expensePartial as ExpenseInsert)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

</script>
