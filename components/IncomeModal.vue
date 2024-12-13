<template>
  <n-modal :show="showModal">
    <n-card class="w-96" role="dialog" :bordered="true" aria-modal="true">
      <template #header>
        <h3 class="text-2xl">Income {{ incomeTemplate.id }}: {{ incomeTemplateRef.name }}</h3>
      </template>
      <template #default>
        <Form>
          <section>
            <FormField :field="fieldMetadata.name" :model="incomeTemplateRef"></FormField>
            <FormSelect :field="fieldMetadata.incomeType" :model="incomeTemplateRef"></FormSelect>
            <FormField :field="fieldMetadata.grossIncome" :model="incomeTemplateRef"></FormField>
            <FormField :field="fieldMetadata.growthRate" :model="incomeTemplateRef"></FormField>
          </section>
        </Form>
      </template>

      <template #action>
        <n-button type="success" @click="handleSave">
          <template #icon>
            <Icon name="mdi:content-save"/>
          </template>
          Add
        </n-button>
        <n-button secondary round type="error" @click="handleClose">
          <template #icon>
            <Icon name="mdi:close"/>
          </template>
          Cancel
        </n-button>
      </template>
    </n-card>
  </n-modal>

</template>
<script setup lang="ts">
import {incomeFields} from '~/forms/incomeForm';
import type {IncomeTemplate} from '~/models/income/IncomeTemplate';

interface Props {
  incomeTemplate: IncomeTemplate;
}

const props = defineProps<Props>();

const incomeTemplateRef = ref<IncomeTemplate>(JSON.parse(JSON.stringify(props.incomeTemplate)))
const fieldMetadata = incomeFields;
const showModal = ref(false);

const emit = defineEmits(['save', 'close']);

function handleSave() {
  emit('save', incomeTemplateRef.value)

}

function handleClose() {
  emit('close')
}
onMounted(async () => {
  showModal.value = true;
})


</script>