<template>
  <Teleport to="#right-side-bar">
    <PlanSummary :planManager="planManager"></PlanSummary>
  </Teleport>
  <div class="col-span-4 space-y-6">
    <InputToggle name="showAdvancedOptions" v-model="showAdvancedOptions" label="Show Advanced Options"/>
    <PlanRetirement :showAdvancedOptions="showAdvancedOptions"/>

    <!-- Incomes -->
    <CommonCard class="space-y-6 bg-skin-muted">
      <div class="flex align-middle gap-6">
        <h2 class="text-3xl">IncomeConfig(s)</h2>
        <CommonButton @click="handleAddIncome">Add Income</CommonButton>
      </div>
      <CommonList>
        <PlanIncome
            v-for="(income, index) in planConfig.incomes"
            :income="income"
            :key="index"
            :incomeIndex="index"
            :showAdvancedOptions="showAdvancedOptions"
            @deleteIncome="handleDeleteIncome"
        ></PlanIncome>
      </CommonList>
    </CommonCard>

    <!-- Expenses -->
    <CommonCard class="space-y-6 bg-skin-muted">
      <div class="flex align-middle gap-6">
        <h2 class="text-3xl">ExpenseConfig PlanConfig</h2>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <CommonCard @click="planConfig.activeExpensePlan='simple'" :class="{'bg-skin-accent': planConfig.activeExpensePlan==='simple'}">
          <h3 class="text-2xl">Simple ExpenseConfig PlanConfig</h3>
        </CommonCard>
        <CommonCard @click="planConfig.activeExpensePlan='itemized'" :class="{'bg-skin-accent': planConfig.activeExpensePlan==='itemized'}">
          <h3 class="text-2xl">Itemized ExpenseConfig PlanConfig</h3>
        </CommonCard>
      </div>
      <ExpensePlan :expensePlan="planConfig.simpleExpensePlan"></ExpensePlan>
      <ExpensePlan :expensePlan="planConfig.itemizedExpensePlan"></ExpensePlan>
    </CommonCard>

    <!-- CashConfig Maintenance -->
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">CashConfig to Maintain</h2>
      </nav>
      <PlanCash
          :cash="planConfig.cash"
          :showAdvancedOptions="showAdvancedOptions"
      ></PlanCash>
    </CommonCard>

    <!-- Debts -->
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">DebtConfig(s)</h2>
        <CommonButton @click="planConfig.addDebt()">Add DebtConfig</CommonButton>
      </nav>
      <PlanDebt
          v-for="(debt, index) in planConfig.debts"
          :debt="debt"
          :key="index"
          :debtIndex="index"
          :showAdvancedOptions="showAdvancedOptions"
          @deleteDebt="handleDeleteDebt"
      ></PlanDebt>
    </CommonCard>
    <CommonCard class="bg-skin-muted space-y-6">
      <nav class="flex align-middle gap-6">
        <h2 class="text-3xl">Tax Deferred Investments</h2>
        <CommonButton @click="planConfig.addTaxDeferredInvestment()">Add IncomeConfig</CommonButton>
      </nav>
      <CommonList>
        <PlanTaxDeferredInvestment
            v-for="(investment, index) in planConfig.taxDeferredInvestments"
            :investment="investment"
            :key="index"
            :investmentIndex="index"
            :showAdvancedOptions="showAdvancedOptions"
            @deleteInvestment="handleDeleteTaxDeferredInvestment"
        />
      </CommonList>
    </CommonCard>
  </div>
</template>
<script setup lang="ts">
import InputToggle from "~/components/form/InputToggle.vue";
import ExpensePlan from "~/components/plan/ExpensePlan.vue";
import PlanConfig from "~/models/plan/PlanConfig";
import PlanManager from "~/models/plan/PlanManager";

useHead({
  title: 'Calcura Dashboard',
  meta: [
    {name: 'description', content: 'Calcura: Dashboard'}
  ],
})

function handleAddIncome(){
  planConfig.addIncome()
}

function handleDeleteIncome(payload: { index: number }) {
  planConfig.deleteIncome(payload.index)
}

function handleDeleteTaxDeferredInvestment(payload: { index: number }) {
  planConfig.deleteTaxDeferredInvestment(payload.index)
}

function handleDeleteDebt(payload: { index: number }) {
  planConfig.deleteDebt(payload.index)
}

const planConfig = reactive(new PlanConfig(PlanConfig.defaultValues()))
const planManager = reactive(new PlanManager(planConfig))

const showAdvancedOptions = ref<boolean>(false)
</script>