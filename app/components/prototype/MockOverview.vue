<script setup lang="ts">
// PROTOTYPE — throwaway. Density backdrop: stat tiles + entity lists so the
// drawer / inline panel has real content to sit against.
type MockEntity = { id: number, model_name: string, label: string, sub: string, icon: string }

defineProps<{
  entities: { title: string, addModel: string, addLabel: string, rows: MockEntity[] }[]
}>()
const emit = defineEmits<{ edit: [model: string, id: number], add: [model: string] }>()

const tiles = [
  {label: 'Projected retirement', value: '58', unit: 'yrs', tone: 'text-skin-primary'},
  {label: 'Net worth at retirement', value: '$2.4M', unit: '', tone: 'text-skin-success'},
  {label: 'Years simulated', value: '34', unit: '', tone: 'text-skin-base'},
  {label: 'Active commands', value: '9', unit: '', tone: 'text-skin-base'},
]
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div v-for="tile in tiles" :key="tile.label" class="rounded-lg border border-skin-base bg-skin-surface p-4">
        <div class="text-xs text-skin-muted">{{ tile.label }}</div>
        <div class="mt-1 text-2xl font-semibold" :class="tile.tone">
          {{ tile.value }} <span class="text-sm text-skin-muted">{{ tile.unit }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="group in entities" :key="group.title" class="rounded-lg border border-skin-base bg-skin-surface">
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-skin-base">
          <h3 class="text-sm font-semibold">{{ group.title }}</h3>
          <n-button size="tiny" secondary round @click="emit('add', group.addModel)">
            <template #icon><base-ico name="add"/></template>
            {{ group.addLabel }}
          </n-button>
        </div>
        <div class="divide-y divide-skin-base">
          <div
              v-for="row in group.rows"
              :key="row.id"
              class="flex items-center gap-3 px-4 py-2.5 hover:bg-skin-surface-hover cursor-pointer"
              @click="emit('edit', row.model_name, row.id)"
          >
            <base-ico :name="row.icon" class="text-lg text-skin-muted"/>
            <div class="min-w-0 flex-1">
              <div class="truncate text-sm">{{ row.label }}</div>
              <div class="truncate text-xs text-skin-muted">{{ row.sub }}</div>
            </div>
            <base-ico name="edit" class="text-skin-muted"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
