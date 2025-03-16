<script lang="ts" setup>

import {useArticleValidator} from "~/composables/validators/useArticleValidator";
import type {Article} from "~/types/Article";
import DOMPurify from "dompurify";

interface Props {
  initialValues?: Partial<Article>;
  mode: 'create' | 'edit'
}

const {initialValues = {content: '???'}} = defineProps<Props>();
const emit = defineEmits(["update", "cancel", "create"]);

const {formRef, modelRef, rules, handleCreate, handleUpdate, handleCancel} =
    useCrudFormWithValidation(initialValues, emit, useArticleValidator);


const sanitizedContent = computed(() => {
  if (modelRef?.value?.content) {
    return DOMPurify.sanitize(modelRef.value.content)
  }
  return ''
});
</script>
<template>
  <div class="flex justify-evenly">
    <n-card role="dialog" :bordered="true">
      <template #header>
        <h3 class="text-2xl">Add New Article</h3>
      </template>

      <template #default>
        <n-form ref="formRef" :model="modelRef" :rules="rules">
          <n-form-item path="title" label=" Title">
            <n-input v-model:value="modelRef.title" placeholder="Enter the title of the investment"/>
          </n-form-item>
          <n-form-item path="content" label="Content">
            <base-editor v-model="modelRef.content"></base-editor>
          </n-form-item>
        </n-form>
      </template>
    </n-card>
    <n-card role="dialog" class="max-w-6xl" :bordered="true">
      <article class="prose prose-skin">
        {{ modelRef.content }}
        <h1>{{ modelRef.title }}</h1>
        <div v-html="sanitizedContent"></div>
      </article>
    </n-card>
  </div>
</template>