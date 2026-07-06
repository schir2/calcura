<script setup lang="ts">
// Plan Overview: KPI row → net-worth spine → Income / Spending / Investments / Liabilities sections,
// each a chart + entity list. Composition approved in master artifact cb56a0f0.
import type {Component} from 'vue'
import type {OrchestratorState} from '#shared/types/OrchestratorState'
import type {PlanWithRelations} from '#shared/types/Plan'
import type {ModelName} from '#shared/types/ModelName'
import {
  BrokerageCreateForm, CashReserveCreateForm, DebtCreateForm, ExpenseCreateForm, HsaCreateForm,
  IncomeCreateForm, IraCreateForm, RothIraCreateForm, TaxDeferredCreateForm,
} from '#components'
import NetWorthSpine from '~/components/plan/chart/NetWorthSpine.vue'
import IncomeVsExpenses from '~/components/plan/chart/IncomeVsExpenses.vue'
import RetirementIncome from '~/components/plan/chart/RetirementIncome.vue'
import ExpenseBreakdown from '~/components/plan/chart/ExpenseBreakdown.vue'
import DebtPaydown from '~/components/plan/chart/DebtPaydown.vue'
import SectionHead from './SectionHead.vue'
import EntityRow from './EntityRow.vue'
import VerdictHero from './VerdictHero.vue'
import {overviewStats} from './stats'
import {WORKSPACE_ENABLED_MODELS} from '~/stores/workspaceStore'

const props = defineProps<{ states: OrchestratorState[]; plan?: PlanWithRelations | null }>()
const emit = defineEmits<{ 'create-model': [payload: { model: ModelName, data: unknown }] }>()
const stats = computed(() => overviewStats(props.states))
const workspace = useWorkspaceStore()

const CREATE_FORMS: Record<ModelName, Component> = {
  income: IncomeCreateForm, expense: ExpenseCreateForm, debt: DebtCreateForm,
  cash_reserve: CashReserveCreateForm, tax_deferred: TaxDeferredCreateForm, brokerage: BrokerageCreateForm,
  ira: IraCreateForm, roth_ira: RothIraCreateForm, hsa: HsaCreateForm,
}
const createModel = ref<ModelName | null>(null)
const accountTypeOptions = [
  {label: '401(k) / Tax-deferred', key: 'tax_deferred'},
  {label: 'Brokerage', key: 'brokerage'},
  {label: 'Roth IRA', key: 'roth_ira'},
  {label: 'IRA', key: 'ira'},
  {label: 'HSA', key: 'hsa'},
  {label: 'Cash reserve', key: 'cash_reserve'},
]

function openCreate(model: ModelName) {
  if (WORKSPACE_ENABLED_MODELS.includes(model) && props.plan) {
    workspace.openCreate(model, props.plan.id)
    return
  }
  createModel.value = model
}
function onCreated(data: unknown) {
  if (createModel.value) emit('create-model', {model: createModel.value, data})
  createModel.value = null
}

type HueName = 'blue' | 'green' | 'violet' | 'amber' | 'teal'
const accounts = computed(() => {
  const p = props.plan
  if (!p) return [] as { name: string; amount: number; hueName: HueName }[]
  return [
    ...p.tax_deferreds.map(e => ({name: e.name, amount: e.initial_balance, hueName: 'blue' as HueName})),
    ...p.brokerages.map(e => ({name: e.name, amount: e.initial_balance, hueName: 'green' as HueName})),
    ...p.roth_iras.map(e => ({name: e.name, amount: e.initial_balance, hueName: 'violet' as HueName})),
    ...p.iras.map(e => ({name: e.name, amount: e.initial_balance, hueName: 'violet' as HueName})),
    ...p.hsas.map(e => ({name: e.name, amount: e.initial_balance, hueName: 'teal' as HueName})),
    ...p.cash_reserves.map(e => ({name: e.name, amount: e.initial_amount, hueName: 'amber' as HueName})),
  ]
})

const expenseRows = computed(() => {
  const p = props.plan
  if (!p) return [] as { name: string; amount: number; hueName: 'blue' | 'amber' }[]
  return p.expenses.map(e => ({
    name: e.name,
    amount: getAnnualAmount(e.amount, e.frequency),
    hueName: (e.is_essential ? 'blue' : 'amber') as 'blue' | 'amber',
  }))
})

const debtPrincipal = computed(() =>
  (props.plan?.debts ?? []).reduce((sum, d) => sum + (d.principal ?? 0), 0))

const paidOffAge = computed(() => {
  const cleared = props.states.find(s => s.liabilities.debt.balance_end <= 0 && s.liabilities.debt.paid_lifetime > 0)
  return cleared?.plan.age
})

</script>

<template>
  <div class="space-y-1">
    <VerdictHero v-if="plan" :states="states" :plan="plan"/>

    <n-card class="mt-3">
      <template #header>
        <div class="flex items-baseline justify-between">
          <h3 class="text-base font-semibold">Net worth over time</h3>
          <span class="text-sm text-skin-muted">every account stacked · peak {{ fmtUsd(stats.peakNetWorth) }}</span>
        </div>
      </template>
      <NetWorthSpine :states="states" :height="360"/>
    </n-card>

    <SectionHead
        title="Income" tag="what comes in — and what's left to invest"
        add-label="Add income" dot-class="bg-skin-success" @add="openCreate('income')"/>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
      <n-card title="Income vs. expenses"><IncomeVsExpenses :states="states"/></n-card>
      <n-card title="Your income sources">
        <template v-if="plan && plan.incomes.length">
          <EntityRow v-for="inc in plan.incomes" :key="inc.id"
                     :name="inc.name" :amount="inc.gross_income" suffix="/yr" hue-name="green"/>
        </template>
        <div v-else class="text-sm text-skin-muted py-6 text-center">No income yet.</div>
      </n-card>
    </div>
    <n-card class="mt-3">
      <template #header>
        <div class="flex items-baseline justify-between">
          <span>Projected retirement income</span>
          <span class="text-sm text-skin-muted">green vs. your goal (dashed)</span>
        </div>
      </template>
      <RetirementIncome :states="states" :height="240"/>
    </n-card>

    <SectionHead
        title="Spending" tag="where the money goes — and whether the plan can fund it"
        add-label="Add expense" dot-class="bg-skin-warning" @add="openCreate('expense')"/>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
      <n-card title="Working vs. retirement spending"><ExpenseBreakdown :expenses="plan?.expenses ?? []" :height="170"/></n-card>
      <n-card title="Your expenses">
        <template v-if="expenseRows.length">
          <EntityRow v-for="(exp, i) in expenseRows" :key="i"
                     :name="exp.name" :amount="exp.amount" suffix="/yr" :hue-name="exp.hueName"/>
        </template>
        <div v-else class="text-sm text-skin-muted py-6 text-center">No expenses yet.</div>
      </n-card>
    </div>

    <SectionHead title="Investments" tag="how your money grows across account types" dot-class="bg-skin-info">
      <template #action>
        <n-dropdown trigger="click" :options="accountTypeOptions" @select="openCreate">
          <button
              type="button"
              class="rounded-full border border-skin-primary text-skin-primary bg-skin-primary/10
                     text-xs font-semibold px-3 py-1 hover:border-dashed hover:bg-skin-primary/20
                     transition-colors">
            ＋ Add account
          </button>
        </n-dropdown>
      </template>
    </SectionHead>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
      <n-card title="Balances by account"><NetWorthSpine :states="states" :height="260"/></n-card>
      <n-card>
        <template #header>
          <div class="flex items-baseline justify-between">
            <span>Accounts</span>
            <span class="text-sm text-skin-muted">starting balance</span>
          </div>
        </template>
        <template v-if="accounts.length">
          <EntityRow v-for="(acc, i) in accounts" :key="i"
                     :name="acc.name" :amount="acc.amount" :hue-name="acc.hueName"/>
        </template>
        <div v-else class="text-sm text-skin-muted py-6 text-center">No accounts yet.</div>
      </n-card>
    </div>

    <SectionHead
        title="Liabilities" tag="debt burning down — and what interest really cost"
        add-label="Add debt" dot-class="bg-skin-error" @add="openCreate('debt')"/>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
      <n-card title="Debt paydown"><DebtPaydown :states="states" :height="260"/></n-card>
      <n-card title="Cost of borrowing">
        <div class="grid grid-cols-3">
          <div class="px-3">
            <div class="text-xs text-skin-muted font-semibold">Principal</div>
            <div class="text-lg font-bold tabular-nums">{{ fmtUsd(debtPrincipal) }}</div>
          </div>
          <div class="px-3 border-l border-skin-base">
            <div class="text-xs text-skin-muted font-semibold">Interest</div>
            <div class="text-lg font-bold tabular-nums text-skin-error">{{ fmtUsd(stats.totalInterestPaid) }}</div>
          </div>
          <div class="px-3 border-l border-skin-base">
            <div class="text-xs text-skin-muted font-semibold">Paid off</div>
            <div class="text-lg font-bold tabular-nums">{{ paidOffAge ? `age ${paidOffAge}` : '—' }}</div>
          </div>
        </div>
      </n-card>
    </div>

    <n-modal :show="createModel !== null" @update:show="(v: boolean) => { if (!v) createModel = null }">
      <component
          :is="CREATE_FORMS[createModel]"
          v-if="createModel"
          :initial-values="{ plan_id: plan?.id }"
          @create="onCreated"
          @cancel="createModel = null"/>
    </n-modal>
  </div>
</template>
