<template>

  <draggable class="dragArea list-group w-full"
             v-model="commandsRef"
             group="commands"
             handle=".drag-handle"
             @start="drag=true"
             @end="drag=false"
             :animation="300"
             item-key="id"
             @change="onChange">
    <template #item="{element: command} : {element: Command}">
      <CommandSequenceCommand :command="command"/>
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
