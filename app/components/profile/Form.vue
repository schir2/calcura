<script lang="ts" setup>
import type {UserProfile, UserProfileInsert, UserProfileUpdate} from "#shared/types/UserProfile"
import {userProfileRules} from "~/utils/validators/userProfileRules"
import {FORM_LABEL_ALIGN, FORM_LABEL_PLACEMENT, FORM_MODAL_WIDTH_CLASS} from "~/constants/FormConstants"

type Props = {
  initialValues?: Partial<UserProfile>
  mode: 'create' | 'edit'
}
const {initialValues, mode} = defineProps<Props>()

const emit = defineEmits<{
  create: [insert: UserProfileInsert]
  update: [id: number, update: UserProfileUpdate]
  cancel: []
}>()

const model = ref<Partial<UserProfile>>({...initialValues})
const {formRef, rules, apiErrors, onSubmit} = useNaiveForm(model)
const errorMessage = ref('')
rules.value = userProfileRules(model).rules


const birthdayTimestamp = computed<number | null>({
  get: () => (model.value.birthday ? new Date(model.value.birthday).getTime() : null),
  set: (value) => {
    model.value.birthday = value ? new Date(value).toISOString().slice(0, 10) : null
  },
})

function handleCreate() {
  onSubmit(async () => {
    const {id: _id, ...insert} = model.value as UserProfile
    emit('create', insert as UserProfileInsert)
  })
}

function handleUpdate() {
  onSubmit(async () => {
    const {id, ...update} = model.value as UserProfile
    emit('update', id, update as UserProfileUpdate)
  })
}
</script>
<template>
  <n-card role="dialog" :class="FORM_MODAL_WIDTH_CLASS" :bordered="true">
    <template #header>
      <h2 class="text-title">Profile</h2>
    </template>

    <template #default>
      <n-alert v-if="Object.keys(apiErrors).length > 0" type="error" :title="errorMessage || 'An error occurred'" class="mb-4" />
      <n-form
          ref="formRef"
          :model="model"
          :rules="rules"
          :label-placement="FORM_LABEL_PLACEMENT"
          :label-align="FORM_LABEL_ALIGN"
      >
        <n-form-item path="first_name" label="First Name">
          <n-input v-model:value="model.first_name" placeholder="Enter your first name"/>
        </n-form-item>

        <n-form-item path="last_name" label="Last Name">
          <n-input v-model:value="model.last_name" placeholder="Enter your last name"/>
        </n-form-item>

        <n-form-item path="birthday" label="Birthday">
          <n-date-picker v-model:value="birthdayTimestamp" placeholder="Enter your birthday"/>
        </n-form-item>

        <n-form-item path="life_expectancy" label="Life Expectancy">
          <n-input-number v-model:value="model.life_expectancy" placeholder="Enter your life expectancy"/>
        </n-form-item>
      </n-form>
    </template>

    <template #action>
      <FormActionButtons :variant="mode === 'edit' ? 'update' : 'create'" @update="handleUpdate"
                         @create="handleCreate" @cancel="emit('cancel')"/>
    </template>
  </n-card>
</template>