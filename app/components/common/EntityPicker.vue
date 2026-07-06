<script setup lang="ts">
// Category → entity chooser. Shown when a clicked category (chart band/legend) holds
// more than one entity; lets the user pick which entity's Workspace to open, or add another.
import type {ModelName} from '#shared/types/ModelName'

const props = defineProps<{
  show: boolean
  entities: { model: ModelName; id: number; name: string }[]
  title?: string
  addModel?: ModelName
}>()

const emit = defineEmits<{
  select: [model: ModelName, id: number]
  add: [model: ModelName]
  'update:show': [value: boolean]
}>()

function pick(model: ModelName, id: number) {
  emit('select', model, id)
  emit('update:show', false)
}

function addAnother() {
  if (props.addModel) emit('add', props.addModel)
  emit('update:show', false)
}
</script>

<template>
  <n-modal :show="show" @update:show="(v: boolean) => emit('update:show', v)">
    <n-card
        :title="title ?? 'Which one?'"
        class="max-w-sm"
        closable
        @close="emit('update:show', false)">
      <div class="flex flex-col gap-1.5">
        <button
            v-for="e in entities"
            :key="`${e.model}-${e.id}`"
            type="button"
            class="flex items-center gap-2.5 rounded-lg border border-skin-base/40 bg-skin-surface
                   px-3 py-2 text-left hover:bg-skin-surface-hover transition-colors"
            @click="pick(e.model, e.id)">
          <span class="font-medium text-sm text-skin-base truncate">{{ e.name }}</span>
        </button>
        <button
            v-if="addModel"
            type="button"
            class="flex items-center gap-2.5 rounded-lg border border-dashed border-skin-primary
                   text-skin-primary bg-skin-primary/10 px-3 py-2 text-left text-sm font-semibold
                   hover:bg-skin-primary/20 transition-colors"
            @click="addAnother">
          ＋ Add another
        </button>
      </div>
    </n-card>
  </n-modal>
</template>
