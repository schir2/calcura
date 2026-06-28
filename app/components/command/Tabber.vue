<script lang="ts" setup>
import type {CommandSequenceWithRelations} from "#shared/types/CommandSequence";
import type {PlanWithRelations} from "#shared/types/Plan";
import type {ModelName} from "#shared/types/ModelName";

type Props = {
  command_sequences: CommandSequenceWithRelations[]
  plan: PlanWithRelations
}
const props = defineProps<Props>()
const activeTab = defineModel<number | null>();

const emit = defineEmits<{
  update: [payload: { modelName: ModelName, id: number, data: Record<string, unknown> }]
  delete: [payload: { modelName: ModelName, id: number }]
  'delete-sequence': [id: number]
  'rename-sequence': [id: number, name: string]
  'create-sequence': []
}>()

const pendingDeleteId = ref<number | null>(null)
const editingSequenceId = ref<number | null>(null)
const editingName = ref('')

const showContextMenu = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const contextMenuSequenceId = ref<number | null>(null)

const addable = computed(() => props.command_sequences.length <= 5)
const closeable = computed(() => props.command_sequences.length > 1)

const contextMenuOptions = computed(() => [
  {label: 'Rename', key: 'rename'},
  ...(closeable.value ? [{label: 'Delete', key: 'delete'}] : []),
])

function openContextMenu(event: MouseEvent, commandSequence: CommandSequenceWithRelations) {
  event.preventDefault()
  showContextMenu.value = false
  contextMenuSequenceId.value = commandSequence.id
  contextMenuX.value = event.clientX
  contextMenuY.value = event.clientY
  nextTick(() => { showContextMenu.value = true })
}

function handleContextMenuSelect(key: string) {
  showContextMenu.value = false
  const id = contextMenuSequenceId.value
  if (id === null) return
  if (key === 'rename') {
    const seq = props.command_sequences.find(s => s.id === id)
    if (seq) {
      editingName.value = seq.name
      editingSequenceId.value = id
    }
  } else if (key === 'delete') {
    pendingDeleteId.value = id
  }
}

function handleConfirmDelete(id: number) {
  pendingDeleteId.value = null
  emit('delete-sequence', id)
}

function handleConfirmRename(id: number) {
  if (editingSequenceId.value !== id) return
  const trimmed = editingName.value.trim()
  if (!trimmed) return
  editingSequenceId.value = null
  emit('rename-sequence', id, trimmed)
}

function handleCancelRename() {
  editingSequenceId.value = null
  editingName.value = ''
}

function startRename(commandSequence: CommandSequenceWithRelations) {
  editingName.value = commandSequence.name
  editingSequenceId.value = commandSequence.id
}

</script>
<template>
  <n-dropdown
      :show="showContextMenu"
      :options="contextMenuOptions"
      :x="contextMenuX"
      :y="contextMenuY"
      placement="bottom-start"
      trigger="manual"
      @clickoutside="showContextMenu = false"
      @select="handleContextMenuSelect"
  />
  <n-tabs
      v-model:value="activeTab"
      type="card"
      :addable="addable"
      tab-style="min-width: 80px;"
      @add="$emit('create-sequence')"
  >
    <n-tab-pane v-for="commandSequence in command_sequences" :key="commandSequence.id" :name="commandSequence.id">
      <template #tab>
        <n-popconfirm
            :show="pendingDeleteId === commandSequence.id"
            @update:show="(val) => { if (!val) pendingDeleteId = null }"
        >
          <template #trigger>
            <div class="group flex items-center gap-1" @contextmenu.prevent="openContextMenu($event, commandSequence)">
              <template v-if="editingSequenceId === commandSequence.id">
                <n-input
                    v-model:value="editingName"
                    size="tiny"
                    @keyup.enter.stop="handleConfirmRename(commandSequence.id)"
                    @keyup.escape.stop="handleCancelRename"
                    @click.stop
                />
                <n-button text type="success" @click.stop="handleConfirmRename(commandSequence.id)">
                  <template #icon>
                    <Icon name="mdi:check"/>
                  </template>
                </n-button>
                <n-button text @click.stop="handleCancelRename">
                  <template #icon>
                    <Icon name="mdi:close"/>
                  </template>
                </n-button>
              </template>
              <template v-else>
                <span>{{ commandSequence.name }}</span>
                <n-button
                    text
                    class="opacity-0 group-hover:opacity-100 transition-opacity"
                    @click.stop="startRename(commandSequence)"
                >
                  <template #icon>
                    <Icon name="mdi:pencil"/>
                  </template>
                </n-button>
              </template>
            </div>
          </template>
          <template #icon>
            <Icon class="text-6xl text-skin-error" name="mdi:delete"/>
          </template>
          <template #action>
            <n-button tertiary round @click="pendingDeleteId = null">Cancel</n-button>
            <n-button tertiary type="error" round @click="handleConfirmDelete(commandSequence.id)">
              <template #icon>
                <Icon name="mdi:delete"/>
              </template>
              Delete
            </n-button>
          </template>
          <div class="max-w-md px-3 pe-3">
            <h2 class="text-xl my-3 text-skin-error font-semibold">Delete Sequence</h2>
            <p>Are you sure you want to delete this sequence?</p>
            <p class="text-skin-info text-xs mb-2">This will permanently remove this sequence and all its commands.</p>
          </div>
        </n-popconfirm>
      </template>
      <CommandSequence
          :commandSequence="commandSequence"
          :plan="plan"
          @update="$emit('update', $event)"
          @delete="$emit('delete', $event)"
      />
    </n-tab-pane>
  </n-tabs>
</template>
