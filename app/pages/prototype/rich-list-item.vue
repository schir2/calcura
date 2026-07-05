<!--
  PROTOTYPE — throwaway. Rich List Item redesign (single chosen design: "Compact").
  Question: what should the command-sequence list item look like, incl. mobile? (grill 2026-07-04)
  layout: false so there's no navbar/sidebar eating width — makes mobile behavior honest.
  Mock data stands in for per-entity Manager State History; no auth, no Supabase, no real sim.
  Fold into command/ListItem.vue + the domain *ListItem.vue wrappers, then delete this.
-->
<script setup lang="ts">
import {mockItems} from "~/components/prototype/richListItem/mock";
import RichListItem from "~/components/prototype/richListItem/RichListItem.vue";

definePageMeta({layout: false})

// per-item persistent expand state on the item; drag is a transient override.
const items = reactive(mockItems.map(item => ({...item, expanded: false})))
const dragging = ref(false)

function isExpanded(item: { expanded: boolean }): boolean {
  return dragging.value ? false : item.expanded
}
function toggle(item: { expanded: boolean }) {
  item.expanded = !item.expanded
}
function expandAll() {
  items.forEach(item => (item.expanded = true))
}
function collapseAll() {
  items.forEach(item => (item.expanded = false))
}
</script>

<template>
  <NaiveConfig>
    <div class="min-h-screen bg-skin-base/5">
      <div class="max-w-3xl mx-auto p-3 sm:p-4 space-y-4">
        <div class="rounded border border-skin-warning/40 bg-skin-warning/5 px-3 py-2 text-xs text-skin-muted">
          🧪 <b>Prototype</b> — Rich List Item (Compact). No navbar, resize the window to test mobile.
          Data is mock (stands in for Manager State History).
        </div>

        <!-- global controls + drag simulation -->
        <div class="flex items-center gap-2 text-sm">
          <n-button size="small" @click="expandAll">
            <template #icon><base-ico name="down"/></template>Expand all
          </n-button>
          <n-button size="small" @click="collapseAll">
            <template #icon><base-ico name="up"/></template>Collapse all
          </n-button>
          <span class="flex-1"/>
          <span class="text-xs text-skin-muted">simulate drag</span>
          <n-switch v-model:value="dragging" size="small"/>
        </div>

        <!-- faux command-sequence ordering bar (mirrors command/Sequence.vue) -->
        <div class="flex items-center gap-2.5 px-2.5 py-1.5 rounded border text-xs border-skin-base/20 bg-skin-surface">
          <n-button size="tiny" type="info" secondary>
            <template #icon><base-ico name="lock"/></template>Locked — predefined
          </n-button>
          <span class="text-skin-muted truncate">income → debt → expense → savings</span>
        </div>

        <!-- the list: wrapper owns drag handle + active switch; item owns the rest -->
        <div class="space-y-2">
          <div v-for="item in items" :key="item.id" class="flex items-center gap-1.5 sm:gap-2">
            <base-ico name="drag"
                      :class="dragging ? 'text-skin-primary' : 'text-skin-primary/60 cursor-move'"
                      class="text-2xl shrink-0"/>
            <n-switch v-model:value="item.is_active" :round="false" size="small" class="shrink-0"/>
            <div class="flex-1 min-w-0">
              <RichListItem :item="item" :expanded="isExpanded(item)" @toggle="toggle(item)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NaiveConfig>
</template>