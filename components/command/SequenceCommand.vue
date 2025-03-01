<template>
  <n-card size="small"
          :key="command.name"
  >
    <p class="cursor-grab flex justify-between items-center drag-handle">
      <span class="flex items-center gap-3">
        <base-ico class="text-2xl text-skin-base/20" name="drag"/>{{ command.name }}</span>
      <n-tag>{{ command.label }}</n-tag>
    </p>
  </n-card>
</template>
<script lang="ts" setup>
import type {Command} from "~/types/Command";

interface Props {
  command: Command
}

const {command} = defineProps<Props>();
</script>