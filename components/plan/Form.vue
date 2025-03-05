<script lang="ts" setup>
import {type Plan} from "~/types/Plan";
import {usePlanValidator} from "~/composables/validators/usePlanValidator";
import {planDefaults} from "~/constants/planConstants";
import {FORM_MODAL_WIDTH_CLASS} from "~/constants/FormConstants";

interface Props {
  initialValues?: Partial<Plan>;
  mode?: 'create' | 'edit'
}

const {initialValues = planDefaults, mode = 'create'} = defineProps<Props>();
const emit = defineEmits(['create', 'update', 'cancel'])
const {formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel} =
    useCrudFormWithValidation<Plan>(initialValues, emit, usePlanValidator)

const currentStep = ref<number>(1);

function handleClickPrevious(){
  if(currentStep.value <= 1){
    return
  }
  currentStep.value -= 1
}
function handleClickNextStep(){
  if(currentStep.value >= 3){
    return
  }
  currentStep.value += 1
}

function handleStepChange(payload: { value: number, oldValue: number }) {
}

</script>
<template>
  <n-card role="dialog" :bordered="true">
    <template #header>
      <h3 class="text-2xl mb-2">
        Plan{{ modelRef.name }}{{ currentStep }}</h3>
    </template>
    <template #default>
      <div class="space-y-4">
        <PlanFormSteps v-model="currentStep" @update="handleStepChange"/>
        <n-form
            ref="formRef"
            :model="modelRef"
            :rules="rules">
          <PlanFormProfile v-if="currentStep===1" v-model="modelRef"/>
          <PlanFormSettings v-else-if="currentStep===2" v-model="modelRef"/>
          <PlanFormGoals v-else-if="currentStep===3" v-model="modelRef"/>
      </n-form>
      </div>

    </template>

    <template #action>
<!--      <n-button-group>-->
<!--        <n-button type="error" @click="handleCancel">Cancel</n-button>-->
<!--        <n-button :disabled="currentStep <= 1" type="primary" secondary @click="handleClickPrevious">Previous</n-button>-->
<!--        <n-button :disabled="currentStep  >= 3" type="primary" secondary @click="handleClickNextStep">Next</n-button>-->
<!--        <n-button :disabled="currentStep  >= 3" type="primary" secondary @click="handleClickNextStep">Next</n-button>-->
<!--      </n-button-group>-->
      <FormActionButtons :mode="mode" @update="handleUpdate" @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>
</template>