<template>

  <VueDraggableNext v-if="list" class="dragArea list-group w-full" :list="list" @change="onChange">
    <n-card size="small"
        v-for="element in list"
        :key="element.name"
    >
      <p class="cursor-grab flex justify-between items-center">
      <span class="flex items-center gap-3">
        <Icon class="text-2xl text-skin-base/20" name="mdi:drag"/>{{ element.name }}</span>
      <n-tag>{{ element.label }}</n-tag>
      </p>
    </n-card>
  </VueDraggableNext>

</template>
<script setup lang="ts">
import type {Command} from "~/types/Command";
import {VueDraggableNext} from "vue-draggable-next";

interface Props {
  commands: Command[]
}

const props = defineProps<Props>()
const list = ref([...props.commands])
watch(() => props.commands, (newCommands) => {
  list.value = [...newCommands];
}, { deep: true });

const emits = defineEmits(['update'])

function onChange() {
  emits('update', [...list.value])
}
</script>
