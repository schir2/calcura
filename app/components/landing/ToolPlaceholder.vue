<!-- Placeholder where the live anonymous mini-tool will later mount. -->
<template>
  <div
    class="relative rounded-xl border border-dashed border-skin-primary/50 bg-skin-surface/40 overflow-hidden"
    :class="compact ? 'p-6' : 'p-8'"
  >
    <!-- faux tool chrome so the space reads as "an interactive thing lives here" -->
    <div class="flex items-center gap-2 mb-4 opacity-60">
      <span class="w-3 h-3 rounded-full bg-skin-error" />
      <span class="w-3 h-3 rounded-full bg-skin-warning" />
      <span class="w-3 h-3 rounded-full bg-skin-success" />
    </div>

    <div class="flex flex-col gap-3 opacity-70">
      <div class="flex items-center gap-3">
        <span class="text-skin-muted text-sm w-20">Income</span>
        <div class="grow h-2 rounded-full bg-skin-muted/40">
          <div class="h-2 rounded-full bg-skin-primary w-3/4" />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-skin-muted text-sm w-20">Invest %</span>
        <div class="grow h-2 rounded-full bg-skin-muted/40">
          <div class="h-2 rounded-full bg-skin-info w-1/2" />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-skin-muted text-sm w-20">Debt payoff</span>
        <div class="grow h-2 rounded-full bg-skin-muted/40">
          <div class="h-2 rounded-full bg-skin-warning w-2/5" />
        </div>
      </div>
      <div class="mt-2 h-24 rounded-lg bg-gradient-to-t from-skin-primary/20 to-transparent border border-skin-primary/20" />
    </div>

    <div class="absolute inset-0 flex items-center justify-center">
      <n-tag :bordered="false" type="primary" size="large" round class="shadow-elevation-2">
        ▶ Interactive playground · coming soon
      </n-tag>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ compact?: boolean }>()
</script>
