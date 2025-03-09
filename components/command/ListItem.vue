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
  if (!props.modelName) {
    return ''
  }
  const colorClassArray: string[] = []
  colorClassArray.push(ModelTextColor[props.modelName])
  return colorClassArray.join(' ')
})
</script>
<template>
  <div class="w-full">
    <div class="flex justify-between">
      <div class="flex gap-2 items-center">
        <slot name="header">
          <h3 class="flex items-center gap-2 text-lg font-semibold">
            <n-tooltip>
              <template #trigger>
                <base-ico v-if="modelName" :class="textClass" :name="modelName"/>
              </template>
              <span class="capitalize">{{ modelName}}</span>
            </n-tooltip>
            <span>{{ title }}</span>
          </h3>
        </slot>
        <span class="flex">
          <span class="flex justify-between items-center gap-0.5">
            <slot name="tags">
              <template v-for="tag in tags" :key="tag.label">
                <span class="rounded-full text-skin-success/50 broder border-skin-success/50" v-if="!tag.hide">
                  <n-tooltip v-if="tag.iconName">
                    <template #trigger><base-ico :name="tag.iconName"></base-ico></template>
                    <span class="capitalize" v-if="tag.label">{{ tag.label }}</span>
                  </n-tooltip>
                <span v-else class="hidden l:inline">{{ tag.label }}</span>
                </span>
              </template>
            </slot>
          </span>
        </span>
      </div>
      <div class="flex gap-2 items-center">
        <span class="text-md" :class="textClass">
          <slot name="summary">
          </slot>
        </span>
        <slot name="actions">
          <ListItemButtons size="small" @edit="$emit('edit')" @remove="$emit('remove')" @delete="$emit('delete')"/>
        </slot>
      </div>
    </div>
  </div>

</template>