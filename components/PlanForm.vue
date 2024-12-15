<template>
    <n-card role="dialog" :bordered="true" aria-modal="true">
      <template #header>
        <h3 class="text-2xl">Plan {{ planTemplateRef.id }}: {{ planTemplateRef.name }}</h3>
      </template>
      <template #default>
        <FormTextInput v-model:modelValue="planTemplateRef.name" :field="planForm.name" :maxlength="MAX_NAME_LENGTH"/>
        <FormNumberInput :model="planTemplateRef" :field="planForm.age"/>
        <FormNumberInput :model="planTemplateRef" :field="planForm.year"/>
        <FormNumberInput :model="planTemplateRef" :field="planForm.lifeExpectancy"/>
        <n-divider/>
        <n-slider v-model:value="planTemplateRef.taxRate" :marks="sliderMarks"></n-slider>
        <FormSelect :model="planTemplateRef" :field="planForm.taxStrategy"/>
        <n-divider/>
        <FormSelect :model="planTemplateRef" :field="planForm.retirementStrategy"/>
        {{ planTemplateRef.retirementStrategy }}
        <FormNumberInput :model="planTemplateRef" v-if="planTemplateRef.retirementStrategy === 'age'" :field="planForm.retirementAge"/>
        <FormNumberInput :model="planTemplateRef" v-if="planTemplateRef.retirementStrategy === 'target_savings'" :field="planForm.retirementSavingsAmount"/>
        <FormNumberInput :model="planTemplateRef" v-if="planTemplateRef.retirementStrategy === 'percent_rule'" :field="planForm.retirementWithdrawalRate"/>
        <FormTextInput :modelValue="planTemplateRef" v-if="planTemplateRef.retirementStrategy === 'percent_rule'" :field="planForm.retirementPlanGoal"/>
      </template>

      <template #action>
        <n-button-group>
          <n-button type="success" @click="handleCreate">
            <template #icon>
              <Icon name="mdi:content-save"/>
            </template>
            <span v-text="mode === 'create' ? 'Create' : 'Duplicate'"></span>
          </n-button>
          <n-button v-if="mode ==='edit'" type="warning" @click="handleUpdate">
            <template #icon>
              <Icon name="mdi:edit"/>
            </template>
            <span>Update</span>
          </n-button>
          <n-button secondary type="error" @click="handleCancel">
            <template #icon>
              <Icon name="mdi:close"/>
            </template>
            Cancel
          </n-button>
        </n-button-group>
      </template>
    </n-card>
</template>
<script lang="ts" setup>
import {planForm} from "~/forms/planForm";
import type {PlanTemplate} from "~/models/plan/PlanTemplate";
import type {Plan} from "~/models/plan/Plan";

interface Props {
  planPartial: Partial<Plan>;
  mode: 'create' | 'edit'
}

const props = defineProps<Props>();

const planTemplateRef = ref<PlanTemplate>(JSON.parse(JSON.stringify(props.planPartial)))

const taxBrackets = [
  {min: 0, max: 10, label: "Very Low", colorClass: "text-green-500"},
  {min: 11, max: 20, label: "Low", colorClass: "text-blue-500"},
  {min: 21, max: 30, label: "Medium", colorClass: "text-yellow-500"},
  {min: 31, max: 40, label: "High", colorClass: "text-orange-500"},
  {min: 41, max: 50, label: "Very High", colorClass: "text-red-500"},
];


const sliderMarks = Object.fromEntries(
    taxBrackets.map((bracket) => [
      bracket.max,
      `${bracket.max}%`
    ])
);

const emit = defineEmits(['create', 'update', 'cancel'])

function handleCreate() {
  emit('create', planTemplateRef.value)

}

function handleCancel() {
  emit('cancel')
}

function handleUpdate() {
  console.log('props', planTemplateRef.value)
  emit('update', planTemplateRef.value)
}

</script>