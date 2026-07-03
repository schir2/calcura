<script setup lang="ts">
import type {Tool} from '~/constants/tools'
import {isAvailable} from '~/constants/tools'

type Props = {
  tool: Tool
}

const {tool} = defineProps<Props>()

const available = computed(() => isAvailable(tool))
</script>

<template>
  <NuxtLink
      :to="tool.route"
      class="block h-full"
      :class="available ? 'cursor-pointer' : 'pointer-events-none opacity-60'"
  >
    <n-card hoverable class="h-full transition-colors">
      <div class="flex items-start gap-3">
        <Icon :name="tool.icon" class="text-3xl text-skin-primary shrink-0"/>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h3 class="text-xl">{{ tool.label }}</h3>
            <n-tag v-if="!available" size="small" round :bordered="false">soon</n-tag>
          </div>
          <p class="text-skin-muted">{{ tool.description }}</p>
        </div>
      </div>
    </n-card>
  </NuxtLink>
</template>