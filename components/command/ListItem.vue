<script setup lang="ts">
import {ModelName, ModelTextColor} from "~/types/ModelName"
import type {IconName} from "~/components/base/Ico.vue";

interface Tag {
  label?: string | number,
  iconName?: IconName,
  hide?: boolean
}

interface Props {
  modelName?: ModelName,
  title?: string,
  summary?: string,
  tags?: Tag[]
}

const props = defineProps<Props>()

const textClass = computed<string>(() => {
  if (!props.modelName) {return ''}
  const colorClassArray: string[] = []
  colorClassArray.push(ModelTextColor[props.modelName])
  return colorClassArray.join(' ')
})
</script>
<template>
  <n-card size="small">
    <div class="flex justify-between">
      <div class="flex gap-8 items-center">
        <slot name="header">
          <h3 class="flex items-center gap-2 text-lg font-semibold">
            <base-ico class="text-2xl text-skin-base/20" name="drag"/>
            <base-ico v-if="modelName" :class="textClass" :name="modelName"/>
            <span>{{ title }}</span>
          </h3>
        </slot>
        <span class="flex">
          <span class="flex justify-between gap-0.5">
            <slot name="tags">
              <template v-for="tag in tags" :key="tag.label">
                <n-tag disabled round v-if="!tag.hide">
                <template #icon v-if="tag.iconName">
                  <base-ico :name="tag.iconName"></base-ico>
                </template>
                <span v-if="tag.label">{{ tag.label }}</span>
                </n-tag>
              </template>
            </slot>
          </span>
        </span>
      </div>
      <div class="flex gap-2 items-center">
        <span class="text-lg" :class="textClass">
          <slot name="summary">
          </slot>
        </span>
        <slot name="actions">
          <ListItemButtons size="small" @edit="$emit('edit')" @remove="$emit('remove')" @delete="$emit('delete')"/>
        </slot>
      </div>
    </div>
  </n-card>

</template>