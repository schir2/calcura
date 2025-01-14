<template>

    <Sortable v-if="orderedCommands"
        :list="orderedCommands"
        tag="div"
    >
      <template #header>
        ???
      </template>
      <template #item="{element, index}">
        <div class="draggable" :key="element.getName()">
          {{ element.getName() }}
        </div>
      </template>
      <template #footer>
        <footer class="draggable">A footer</footer>
      </template>
    </Sortable>

</template>
<script setup lang="ts">
import { Sortable } from "sortablejs-vue3";
import type Command from "~/models/common/Command";

interface Props {
  commands: Command[]
}

const props = defineProps<Props>()
const orderedCommands = toRef(()=> props.commands)

const emits = defineEmits(['update'])

watch(props.commands, (newValue, oldValue) => {
  console.log(newValue)
  emits('update', newValue)
})
</script>
