<template>
  <aside class="bg-skin-base pt-32 min-h-screen">
    <nav>
      <ul>
        <li>
          <n-button quaternary><template #icon><Icon name="uil:map"/></template>
            <NuxtLink to="/plans">Plans</NuxtLink>
          </n-button>
        </li>
        <li>
          <n-button quaternary><template #icon><Icon name="uil:usd-circle"/></template>
            <NuxtLink to="/incomes">Incomes</NuxtLink>
          </n-button>
        </li>
        <li>
          <n-button quaternary><template #icon><Icon name="mdi:cash"/></template>
            <NuxtLink to="/cashReserves">Reserves</NuxtLink>
          </n-button>
        </li>
        <li>
          <n-button quaternary><template #icon><Icon name="mdi:trending-down"/></template>
            <NuxtLink to="/expenses">Expenses</NuxtLink>
          </n-button>
        </li>
        <li>
          <n-button quaternary><template #icon><Icon name="mdi:trending-down"/></template>
            <NuxtLink to="/debts">Debts</NuxtLink>
          </n-button>
        </li>
        <n-divider/>
        <li>
          <n-button quaternary><template #icon><Icon name="mdi:sack-outline"/></template>
            <NuxtLink to="/brokerageInvestments">Brokerage</NuxtLink>
          </n-button>
        </li>
        <li>
          <n-button quaternary><template #icon><Icon name="mdi-sack-outline"/></template>
            <NuxtLink to="/rothIraInvestments">Roth IRA</NuxtLink>
          </n-button>
        </li>
        <li>
          <n-button quaternary><template #icon><Icon name="mdi-sack-outline"/></template>
            <NuxtLink to="/iraInvestments">IRA</NuxtLink>
          </n-button>
        </li>
        <li>
          <n-button quaternary><template #icon><Icon name="mdi:sack-outline"/></template>
            <NuxtLink to="/taxDeferredInvestments">Tax Deferred</NuxtLink>
          </n-button>
        </li>
      </ul>
    </nav>
  </aside>
</template>
<script setup lang="ts">
</script>