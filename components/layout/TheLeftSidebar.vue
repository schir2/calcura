<template>
  <aside class="bg-skin-surface pt-32 min-h-screen">
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
            <NuxtLink to="/cashes">Cash</NuxtLink>
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
            <NuxtLink to="/brokerages">Brokerage Investments</NuxtLink>
          </n-button>
        </li>
        <li>
          <n-button quaternary><template #icon><Icon name="mdi-sack-outline"/></template>
            <NuxtLink to="/iraInvestments">IRA Investments</NuxtLink>
          </n-button>
        </li>
        <li>
          <n-button quaternary><template #icon><Icon name="mdi:sack-outline"/></template>
            <NuxtLink to="/taxDeferredInvestments">Tax Deferred Investments</NuxtLink>
          </n-button>
        </li>
      </ul>
    </nav>
  </aside>
</template>
<script setup lang="ts">
</script>