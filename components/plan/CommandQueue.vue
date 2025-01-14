<template>
  <n-list>
    <n-list-item v-for="command in orderedCommands" :key="command.getName()">
      {{command.getName()}}
    </n-list-item>
  </n-list>
</template>
<script setup lang="ts">
import type Command from "~/models/common/Command";

interface Props {
  commands: Command[]
}

const props = defineProps<Props>()
const orderedCommands = toRef(props, 'commands')


</script>