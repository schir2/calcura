<script lang="ts" setup>

import {type UserProfile} from "~/types/UserProfile";
import {useCrudFormWithValidation} from "~/composables/useCrudFormWithValidation";
import {FORM_LABEL_ALIGN, FORM_LABEL_PLACEMENT, FORM_MODAL_WIDTH_CLASS} from "~/constants/FormConstants";

interface Props {
  initialValues?: Partial<UserProfile>;
  mode: 'create' | 'edit'
}

const {initialValues, mode} = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel} =
    useCrudFormWithValidation<UserProfile>(initialValues, emit, useUserProfileValidation);


</script>
<template>
  <n-card :class=FORM_MODAL_WIDTH_CLASS :bordered="true">
    <template #header>
      <h3 class="text-2xl">Profile</h3>
    </template>

    <template #default>
      <n-form
          ref="formRef"
          :model="modelRef"
          :rules="rules"
          :label-placement="FORM_LABEL_PLACEMENT"
          :label-align="FORM_LABEL_ALIGN"
      >

        <n-form-item path="firstName" label="First Name">
          <n-input v-model:value="modelRef.firstName" placeholder="Enter your first name"/>
        </n-form-item>


        <n-form-item path="lastName" label="Last Name">
          <n-input v-model:value="modelRef.lastName" placeholder="Enter your last name"/>
        </n-form-item>


        <n-form-item path="birthday" label="Birthday">
          <n-date-picker v-model="modelRef.birthday" placeholder="Enter your birthday"/>
        </n-form-item>


        <n-form-item path="lifeExpectancy" label="First Name">
          <n-input-number v-model:value="modelRef.lifeExpectancy" placeholder="Enter your life expectancy"/>
        </n-form-item>

      </n-form>
    </template>

    <template #action>
      <FormActionButtons :mode="mode" @update="handleUpdate"
                         @create="handleCreate" @cancel="handleCancel"/>
    </template>
  </n-card>


</template>