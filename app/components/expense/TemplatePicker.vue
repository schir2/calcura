<template>
  <n-thing>
    <n-modal v-model:show="showModal">
      <ExpenseCreateForm :initial-values="activeExpensePartial"
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
import {processTemplate} from "~/utils/templateProcessorUtils";
import {expenseDefaults} from "~/constants/ExpenseConstants";

const showModal = ref(false);
const activeExpensePartial = ref<Partial<Expense> | null>()
const expenseTemplateStore = useExpenseTemplateStore()
const templates = computed(() => [expenseDefaults, ...expenseTemplateStore.list.map(t => processTemplate<Partial<Expense>, ExpenseTemplate, Expense>(expenseDefaults, t))])

function handleOpenModal(expenseTemplate: Partial<Expense>) {
  activeExpensePartial.value = expenseTemplate
  showModal.value = true;
}

onMounted(() => {
  expenseTemplateStore.fetchAll()
})

const emit = defineEmits<{
  create: [insert: ExpenseInsert]
}>()

function handleCreate(insert: ExpenseInsert) {
  emit('create', insert)
  showModal.value = false
}

function handleClose() {
  showModal.value = false
}

</script>
