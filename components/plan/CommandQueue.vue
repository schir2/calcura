<template>

  <draggable class="dragArea list-group w-full"
             v-model="commandsRef"
             group="commands"
             @start="drag=true"
             @end="drag=false"
             :animation="300"
             item-key="id"
             @change="onChange">
    <template #item="{element: command} : {element: Command}">
      <n-card size="small"
              :key="command.name"
      >
        <p class="cursor-grab flex justify-between items-center">
      <span class="flex items-center gap-3">
        <Icon class="text-2xl text-skin-base/20" name="mdi:drag"/>{{ command.name }}</span>
          <n-tag>{{ command.label }}</n-tag>
        </p>
      </n-card>
    </template>
  </draggable>
  >

</template>
<script setup lang="ts">
import type {Command} from "~/types/Command";
import draggable from 'vuedraggable';

interface Props {
  commands: Command[]
}

const props = defineProps<Props>()
const commandsRef = ref([...props.commands])
watch(() => props.commands, (newCommands) => {
  commandsRef.value = [...newCommands];
}, {deep: true});

const emits = defineEmits(['update'])

function onChange() {
  emits('update', [...commandsRef.value])
}

const drag = ref<boolean>(false)
</script>
