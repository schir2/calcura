<script setup lang="ts">
// PROTOTYPE — throwaway. Sequence-management body for the consolidated prototype.
// Reuses the REAL domain rich line-items (Income/Expense/Debt ListItem) — do NOT
// recreate these in the real build; wrap the existing components as here.
// Expand/collapse + Expand-all mirror app/components/command/Sequence.vue.
import draggable from 'vuedraggable'
import {DebtListItem, ExpenseListItem, IncomeListItem} from '#components'

type MockCommand = { id: number, model_name: string, is_active: boolean, data: Record<string, unknown> }
type MockSequence = { id: number, name: string, ordering_type: 'predefined' | 'custom', commands: MockCommand[] }

const props = defineProps<{ sequences: MockSequence[], summary?: boolean }>()
const activeId = defineModel<number>('activeId', {required: true})

const active = computed(() => props.sequences.find(s => s.id === activeId.value) ?? props.sequences[0]!)
const isPredefined = computed(() => active.value.ordering_type === 'predefined')
const drag = ref(false)

function onReorder() {
  drag.value = false
  active.value.ordering_type = 'custom'
}
function toggleOrdering() {
  active.value.ordering_type = isPredefined.value ? 'custom' : 'predefined'
}
function toggleCommand(command: MockCommand) {
  command.is_active = !command.is_active
}

// Per-row + global expand state (precedence: drag → per-item → global) — from Sequence.vue.
const expandedOverrides = reactive(new Map<number, boolean>())
const globalExpanded = ref(false)
function isRowExpanded(id: number) {
  if (drag.value) return false
  return expandedOverrides.has(id) ? expandedOverrides.get(id)! : globalExpanded.value
}
function toggleRow(id: number) {
  expandedOverrides.set(id, !isRowExpanded(id))
}
function setAllExpanded(expanded: boolean) {
  globalExpanded.value = expanded
  expandedOverrides.clear()
}

function renderRow(command: MockCommand) {
  switch (command.model_name) {
    case 'income': return h(IncomeListItem, {income: command.data})
    case 'expense': return h(ExpenseListItem, {expense: command.data})
    case 'debt': return h(DebtListItem, {debt: command.data})
    default: return null
  }
}

const activeCount = computed(() => active.value.commands.filter(c => c.is_active).length)

const outcomes = computed(() => props.sequences.map((seq, index) => ({
  id: seq.id, name: seq.name,
  retireAge: 58 + index * 3,
  netWorth: 2_400_000 - index * 320_000,
})))
const usd = (value: number) => new Intl.NumberFormat('en-US', {notation: 'compact', style: 'currency', currency: 'USD'}).format(value)
</script>

<template>
  <div class="space-y-4">
    <n-tabs v-model:value="activeId" type="card" size="small" tab-style="min-width:96px">
      <n-tab-pane v-for="seq in sequences" :key="seq.id" :name="seq.id" :tab="seq.name"/>
      <template #suffix>
        <n-button size="tiny" dashed disabled>
          <template #icon><Icon name="mdi:plus"/></template>
          Sequence
        </n-button>
      </template>
    </n-tabs>

    <!-- ordering control + expand-all (mirrors Sequence.vue) -->
    <div
        v-if="!summary"
        class="flex items-center gap-2.5 px-2.5 py-1.5 rounded border text-xs"
        :class="isPredefined ? 'border-skin-info bg-skin-info/10' : 'border-skin-base bg-skin-surface'"
    >
      <n-button size="tiny" :type="isPredefined ? 'info' : 'default'" :secondary="isPredefined" @click="toggleOrdering">
        <template #icon><base-ico :name="isPredefined ? 'lock' : 'unlock'"/></template>
        {{ isPredefined ? 'Locked — predefined' : 'Unlocked — custom' }}
      </n-button>
      <span :class="isPredefined ? 'text-skin-info' : 'text-skin-muted'">
        {{ isPredefined ? 'income → debt → expense → savings' : 'drag handles to reorder' }}
      </span>
      <span class="flex-1"/>
      <n-button size="tiny" quaternary @click="setAllExpanded(!globalExpanded)">
        <template #icon><base-ico :name="globalExpanded ? 'up' : 'down'"/></template>
        {{ globalExpanded ? 'Collapse all' : 'Expand all' }}
      </n-button>
    </div>

    <draggable
        v-if="!summary"
        v-model="active.commands"
        class="space-y-1.5"
        handle=".drag-handle"
        item-key="id"
        :animation="200"
        :disabled="isPredefined"
        @start="drag = true"
        @end="onReorder"
    >
      <template #item="{element: command}: {element: MockCommand}">
        <div
            class="flex gap-2 items-center border rounded p-1.5 bg-skin-surface transition"
            :class="[command.is_active ? 'border-skin-base' : 'opacity-40 grayscale border-skin-muted']"
        >
          <base-ico
              name="drag"
              :class="['text-2xl drag-handle', isPredefined ? 'opacity-20 cursor-not-allowed' : 'text-skin-primary cursor-move']"
          />
          <n-switch :round="false" size="small" :value="command.is_active" @update:value="toggleCommand(command)"/>
          <component
              :is="renderRow(command)"
              :expanded="isRowExpanded(command.id)"
              :is-active="command.is_active"
              @toggle="toggleRow(command.id)"
          />
        </div>
      </template>
    </draggable>

    <n-divider v-if="!summary" class="!my-2"/>

    <div>
      <div class="flex items-center justify-between mb-2">
        <h4 class="text-sm font-semibold">Strategy comparison</h4>
        <span class="text-xs text-skin-muted">{{ active.name }}: {{ activeCount }}/{{ active.commands.length }} active</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="rounded border border-skin-base bg-skin-surface p-3">
          <div class="text-xs text-skin-muted mb-2">Retirement age by sequence</div>
          <div class="space-y-1.5">
            <div v-for="o in outcomes" :key="o.id" class="flex items-center gap-2">
              <span class="w-20 truncate text-xs" :class="o.id === activeId ? 'text-skin-primary font-semibold' : 'text-skin-muted'">{{ o.name }}</span>
              <div class="h-3 flex-1 rounded bg-skin-muted overflow-hidden">
                <div class="h-full bg-skin-primary" :style="{width: `${(70 - o.retireAge) / 25 * 100}%`}"/>
              </div>
              <span class="w-8 text-right text-xs">{{ o.retireAge }}</span>
            </div>
          </div>
        </div>
        <div class="rounded border border-skin-base bg-skin-surface p-3">
          <div class="text-xs text-skin-muted mb-2">Net worth at retirement</div>
          <div class="space-y-1.5">
            <div v-for="o in outcomes" :key="o.id" class="flex items-center gap-2">
              <span class="w-20 truncate text-xs" :class="o.id === activeId ? 'text-skin-primary font-semibold' : 'text-skin-muted'">{{ o.name }}</span>
              <div class="h-3 flex-1 rounded bg-skin-muted overflow-hidden">
                <div class="h-full bg-skin-success" :style="{width: `${o.netWorth / 2_400_000 * 100}%`}"/>
              </div>
              <span class="w-10 text-right text-xs">{{ usd(o.netWorth) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <slot name="footer"/>
  </div>
</template>
