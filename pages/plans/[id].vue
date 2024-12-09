<template>
  <ClientOnly>
    <Teleport to="#right-side-bar">
      <!--      <PlanSummary :plan="plan"></PlanSummary>-->
    </Teleport>
  </ClientOnly>
  <ClientOnly>
    <Teleport to="#left-side-bar">
      <PlanProjection :planStates="planStates"></PlanProjection>
    </Teleport>
  </ClientOnly>
  <div v-if="plan" class="col-span-4 space-y-6">
    {{ plan }}
    <InputToggle name="showAdvancedOptions" v-model="showAdvancedOptions" label="Show Advanced Options"/>

    Incomes
    <CommonCard class="space-y-6 bg-skin-muted">

      <IncomeList :debts="plan.incomes"
                  @createIncome="handleCreateIncome"
                  @updateIncome="handleUpdateIncome"
                  @deleteIncome="handleDeleteIncome"
      ></IncomeList>
    </CommonCard>

    <!-- Expenses -->
    <CommonCard class="space-y-6 bg-skin-muted">
      <div class="flex align-middle gap-6">
        <h2 class="text-3xl">Expenses</h2>
        <NButton iconLeft="mdi:add" @click="handleAddExpense">Add Expense</NButton>
      </div>
      <CommonList>
        <PlanExpense
            v-for="(expense, index) in plan.expenses"
            :key="index"
            :expenseIndex="index"
            :expense="expense"
            @deleteExpense="handleDeleteExpense"
        />
      </CommonList>
    </CommonCard>

    <!-- CashConfig Maintenance -->
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">CashConfig to Maintain</h2>
      </nav>
      <Cash
          :cash="plan.cashes"
          :showAdvancedOptions="showAdvancedOptions"
      ></Cash>
    </CommonCard>

    <!-- Debts -->
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">Debt(s)</h2>
      </nav>
      <DebtList :debts="plan.debts"
                @createDebt="handleCreateDebt"
                @updateDebt="handleUpdateDebt"
                @deleteDebt="handleDeleteDebt"
      ></DebtList>
    </CommonCard>
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">Tax Deferred Investments</h2>
        <NButton @click="handleAddTaxDeferredInvestment">Add Tax Deferred Investment</NButton>
      </nav>
      <CommonList>
        <PlanTaxDeferredInvestment
            v-for="(investment, index) in plan.taxDeferredInvestments"
            :investment="investment"
            :key="index"
            :investmentIndex="index"
            :showAdvancedOptions="showAdvancedOptions"
            @deleteInvestment="handleDeleteTaxDeferredInvestment"
        />
      </CommonList>
    </CommonCard>
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">Brokerage Investments</h2>
        <NButton @click="handleAddBrokerageInvestment">Add Brokerage Investment</NButton>
      </nav>
      <CommonList>
        <PlanBrokerageInvestment
            v-for="(investment, index) in plan.brokerageInvestments"
            :investment="investment"
            :key="index"
            :investmentIndex="index"
            :showAdvancedOptions="showAdvancedOptions"
            @deleteInvestment="handleDeleteBrokerageInvestment"
        />
      </CommonList>
    </CommonCard>
  </div>
</template>
<script setup lang="ts">
import InputToggle from "~/components/form/InputToggle.vue";
import PlanManager from "~/models/plan/PlanManager";
import type PlanState from "~/models/plan/PlanState";
import {defaultDebtFactory} from "~/models/debt/DebtFactories";
import type DebtConfig from "~/models/debt/DebtConfig";
import type {Plan} from "~/models/plan/Plan";

const planService = usePlanService()
const debtService = useDebtService()
const route = useRoute()
const planId = Number(route.params.id)
const plan = ref<Plan | null>(null)
const loading = ref<boolean>(false);

useHead({
  title: 'Calcura Dashboard',
  meta: [
    {name: 'description', content: 'Calcura: Dashboard'}
  ],
})

async function handleCreateDebt() {
  const debtConfig = defaultDebtFactory();
  await debtService.create(debtConfig)
  await loadPlan();
}

async function handleDeleteDebt(index: number) {
  await debtService.delete(index)
  await loadPlan();
}

async function handleUpdateDebt(debtConfig: DebtConfig) {
  await debtService.update(debtConfig.id, debtConfig)
  await loadPlan();
}

async function loadPlan() {
  try {
    plan.value = await planService.get(planId)
    planManager = new PlanManager(plan.value);
    planStates.value = planManager.simulate();
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadPlan();
});
let planManager: PlanManager | null = null
const planStates = ref<PlanState[]>([])

watch(plan, (newState, previousState) => {
  planManager = new PlanManager(newState)
  planStates.value = planManager.simulate()
})

const showAdvancedOptions = ref<boolean>(false)

onMounted(async () => {
  await loadPlan();
})


</script>