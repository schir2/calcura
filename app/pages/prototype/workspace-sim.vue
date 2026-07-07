<script setup lang="ts">
// PROTOTYPE — throwaway (issue #102). Consolidated single view: Command-Sequence
// management lives as a "Simulation" card at the top of the Overview, opened via a
// top-right toolbar button. Reuses the REAL rich line-items + real workspaceStore
// deep-link. Mock data only — no persistence. Do NOT typecheck this route.
import ManageBody from '~/components/prototype/ManageBody.vue'
import MockOverview from '~/components/prototype/MockOverview.vue'

definePageMeta({layout: 'default'})

// Rich list-items inject managerStates; provide null so they use their fallback series.
provide('managerStates', ref(null))
provide('planStates', ref(null))

const workspace = useWorkspaceStore()

// ---- Mock data (rows carry real domain shapes so the rich items render) ------
const seqId = ref(1)
const income = (id: number, name: string, gross: number, growth: number) =>
    ({id, name, gross_income: gross, growth_rate: growth, frequency: 'annually'})
const expense = (id: number, name: string, amount: number, type: string) =>
    ({id, name, amount, expense_type: type, frequency: 'monthly'})
const debt = (id: number, name: string, principal: number, strategy: string) =>
    ({id, name, principal, payment_strategy: strategy, interest_rate: 5.1, frequency: 'monthly'})

const sequences = reactive([
  {
    id: 1, name: 'Aggressive', ordering_type: 'custom' as const,
    commands: [
      {id: 11, model_name: 'income', is_active: true, data: income(11, 'Salary', 120000, 3)},
      {id: 12, model_name: 'debt', is_active: true, data: debt(12, 'Mortgage', 310000, 'minimum_payment')},
      {id: 13, model_name: 'expense', is_active: true, data: expense(13, 'Living expenses', 4500, 'variable')},
      {id: 14, model_name: 'expense', is_active: true, data: expense(14, 'Rent', 2200, 'fixed')},
      {id: 15, model_name: 'income', is_active: false, data: income(15, 'Side gig', 18000, 0)},
    ],
  },
  {
    id: 2, name: 'Debt-first', ordering_type: 'predefined' as const,
    commands: [
      {id: 21, model_name: 'income', is_active: true, data: income(21, 'Salary', 120000, 3)},
      {id: 22, model_name: 'debt', is_active: true, data: debt(22, 'Mortgage', 310000, 'maximum_payment')},
      {id: 23, model_name: 'expense', is_active: true, data: expense(23, 'Living expenses', 4500, 'variable')},
    ],
  },
  {
    id: 3, name: 'Balanced', ordering_type: 'custom' as const,
    commands: [
      {id: 31, model_name: 'income', is_active: true, data: income(31, 'Salary', 120000, 3)},
      {id: 32, model_name: 'expense', is_active: true, data: expense(32, 'Living expenses', 4500, 'variable')},
      {id: 33, model_name: 'debt', is_active: true, data: debt(33, 'Car loan', 24000, 'minimum_payment')},
    ],
  },
])

const overviewGroups = [
  {
    title: 'Income', addModel: 'income', addLabel: 'Income',
    rows: [{id: 11, model_name: 'income', label: 'Salary', sub: '$120k/yr · 3% growth', icon: 'income'}],
  },
  {
    title: 'Expenses & Debt', addModel: 'expense', addLabel: 'Expense',
    rows: [
      {id: 13, model_name: 'expense', label: 'Living expenses', sub: '$4.5k/mo', icon: 'expense'},
      {id: 12, model_name: 'debt', label: 'Mortgage', sub: '$310k · 5.1%', icon: 'debt'},
    ],
  },
  {
    title: 'Retirement accounts', addModel: 'tax_deferred', addLabel: '401k',
    rows: [{id: 14, model_name: 'tax_deferred', label: '401k', sub: 'Max match', icon: 'taxDeferred'}],
  },
  {
    title: 'Taxable & Cash', addModel: 'brokerage', addLabel: 'Brokerage',
    rows: [{id: 16, model_name: 'brokerage', label: 'Brokerage', sub: 'Overflow', icon: 'brokerage'}],
  },
]

// ---- Manage-simulation drawer (the full editor lives here) -------------------
const manageOpen = ref(false)
function openManage() { manageOpen.value = true }

// ---- Entity edit drawer (real deep-link via workspaceStore) ------------------
const drawerOpen = computed({
  get: () => workspace.isOpen,
  set: (open) => { if (!open) workspace.close() },
})
const entityTitle = computed(() => {
  const verb = workspace.mode === 'create' ? 'New' : 'Edit'
  return `${verb} ${(workspace.modelName ?? 'entity').replace(/_/g, ' ')}`
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-6 space-y-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-1">
        <h1 class="text-4xl">Retirement Plan <span class="text-skin-muted text-lg">(prototype)</span></h1>
        <p class="text-skin-muted text-lg">Retire at age 58 · $2.4M target</p>
      </div>
      <n-button type="primary" secondary round @click="openManage">
        <template #icon><Icon name="mdi:tune-variant"/></template>
        Manage simulation
      </n-button>
    </header>

    <n-tabs type="line" animated default-value="overview">
      <n-tab-pane name="overview" tab="Overview">
        <MockOverview :entities="overviewGroups" @edit="(m, id) => workspace.open(m, id)" @add="(m) => workspace.openCreate(m, 1)"/>
      </n-tab-pane>
      <n-tab-pane name="report" tab="Report">
        <div class="rounded-lg border border-dashed border-skin-base p-10 text-center text-skin-muted">
          Report view (unchanged — out of scope for this prototype)
        </div>
      </n-tab-pane>
    </n-tabs>

    <!-- Manage-simulation drawer: the full editor (rich rows, reorder, expand/collapse) -->
    <n-drawer v-model:show="manageOpen" :width="1100" placement="right">
      <n-drawer-content title="Manage simulation" closable body-content-class="!p-5">
        <template #footer>
          <n-button type="primary" @click="manageOpen = false">Done</n-button>
        </template>
        <div class="space-y-5">
          <!-- Add-entity now lets you pick the type — the real "Add Your Stuff" group -->
          <div>
            <div class="text-sm font-semibold mb-2 flex items-center gap-2">
              <base-ico name="create" class="text-skin-success"/> Add to your plan
            </div>
            <PlanChildCreateButtonList :plan_id="1"/>
          </div>
          <ManageBody v-model:active-id="seqId" :sequences="sequences"/>
        </div>
      </n-drawer-content>
    </n-drawer>

    <!-- Entity edit drawer (mock body; real deep-link path from the rich items) -->
    <n-drawer v-model:show="drawerOpen" :width="720" placement="right">
      <n-drawer-content :title="entityTitle" closable body-content-class="!p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section class="space-y-3">
            <p class="text-xs text-skin-muted">Mock form — real build mounts the {{ (workspace.modelName ?? 'entity').replace(/_/g, ' ') }} WorkspaceForm.</p>
            <n-form-item label="Name"><n-input placeholder="Name"/></n-form-item>
            <n-form-item label="Amount"><n-input-number class="w-full" placeholder="Amount"/></n-form-item>
            <div class="flex gap-2">
              <n-button type="primary" @click="workspace.close()">Save</n-button>
              <n-button quaternary @click="workspace.close()">Cancel</n-button>
            </div>
          </section>
          <section class="space-y-2">
            <div class="rounded border border-skin-base bg-skin-surface p-3 text-xs text-skin-muted">
              Live projection preview (entity workspace — unchanged)
            </div>
            <div class="rounded border border-dashed border-skin-base p-6 text-center text-xs text-skin-muted">
              About this {{ (workspace.modelName ?? 'entity').replace(/_/g, ' ') }}
            </div>
          </section>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
