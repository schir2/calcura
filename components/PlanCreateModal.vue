<template>
  <n-modal :show="showModal">
    <n-card class="max-w-xl" role="dialog" :bordered="true" aria-modal="true">
      <template #header>
        <h3 class="text-2xl">Plan {{ planTemplate.id }}: {{ planTemplateRef.name }}</h3>
      </template>
      <template #default>
        <Form>
          <FormTextInput :model="planTemplate" :field="fieldMetadata.name"/>
          <FormTextInput :model="planTemplate" :field="fieldMetadata.year"/>
          <FormTextInput :model="planTemplate" :field="fieldMetadata.lifeExpectancy"/>
          <n-divider/>
          <FormTextInput :model="planTemplate" :field="fieldMetadata.taxRate"/>
          <FormSelect :model="planTemplate" :field="fieldMetadata.taxStrategy"/>
          <n-divider/>
          <FormSelect :model="planTemplate" :field="fieldMetadata.retirementStrategy"/>
          <FormTextInput :model="planTemplate" v-if="planTemplate.retirementStrategy === 'age'" :field="fieldMetadata.retirementAge"/>
          <FormTextInput :model="planTemplate" v-if="planTemplate.retirementStrategy === 'target_savings'" :field="fieldMetadata.retirementSavingsAmount"/>
          <FormTextInput :model="planTemplate" v-if="planTemplate.retirementStrategy === 'percent_rule'" :field="fieldMetadata.retirementWithdrawalRate"/>
          <FormTextInput :model="planTemplate" v-if="planTemplate.retirementStrategy === 'percent_rule'" :field="fieldMetadata.retirementPlanGoal"/>
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
import {planFields} from '~/forms/planForm';
import type {PlanTemplate} from '~/models/plan/PlanTemplate';

interface Props {
  planTemplate: PlanTemplate;
}

const props = defineProps<Props>();

const planTemplateRef = ref<PlanTemplate>(JSON.parse(JSON.stringify(props.planTemplate)))
const fieldMetadata = planFields;
const showModal = ref(false);

const emit = defineEmits(['save', 'close']);

function handleSave() {
  emit('save', planTemplateRef.value)

}

function handleClose() {
  emit('close')
}

onMounted(async () => {
  showModal.value = true;
})


</script>