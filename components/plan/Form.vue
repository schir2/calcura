<script lang="ts" setup>
import {type Plan} from "~/types/Plan";
import {usePlanValidator} from "~/composables/validators/usePlanValidator";
import {planDefaults} from "~/constants/planConstants";

interface Props {
  initialValues?: Partial<Plan>;
  mode?: 'create' | 'edit'
}

const {initialValues = planDefaults, mode = 'create'} = defineProps<Props>();
const emit = defineEmits(['create', 'update', 'cancel'])
const {formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel} =
    useCrudFormWithValidation<Plan>(initialValues, emit, usePlanValidator)

const currentStep = ref<number>(1);
const previousStep = ref<number>(1);

function handleStepChange(payload: { value: number, oldValue: number }) {
}

</script>
<template>
  <n-card role="dialog" class="max-w-6xl" :bordered="true">
    <template #header>
      <h3 class="text-2xl mb-2">Plan{{ modelRef.name }}</h3>
      <PlanFormSteps v-model="currentStep" @update="handleStepChange"/>
    </template>
    <template #default>
      <n-form ref="formRef" :model="modelRef" :rules="rules">
        <PlanFormProfile v-if="currentStep===1" v-model="modelRef"/>
        <PlanFormSettings v-else-if="currentStep===2" v-model="modelRef"/>
        <PlanFormGoals v-else-if="currentStep===3" v-model="modelRef"/>
      </n-form>

    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>