<!-- Six question cards — accent-stripe style (row-colored left bar). -->
<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <div v-for="row in rows" :key="row.label" class="space-y-3">
      <h2 class="text-xl font-semibold text-skin-secondary">{{ row.label }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          v-for="q in row.items"
          :key="q.text"
          class="flex items-start gap-3 p-4 rounded-xl border border-skin-base border-l-4 bg-skin-surface/50"
          :class="row.accentBorder"
        >
          <base-ico :name="q.icon" class="text-2xl shrink-0 mt-0.5" :class="row.accentText" />
          <p class="text-base leading-snug">{{ q.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {IconName} from '~/components/base/Ico.vue'

const rows: {
  label: string
  accentBorder: string
  accentText: string
  items: {text: string; icon: IconName}[]
}[] = [
  {
    label: 'Learn how money works',
    accentBorder: 'border-l-skin-primary',
    accentText: 'text-skin-primary',
    items: [
      {text: 'Why is my cash quietly losing value?', icon: 'trendingDown'},
      {text: 'Why invest instead of a savings account?', icon: 'brokerage'},
      {text: 'What does compounding look like over 30 years?', icon: 'growthRate'},
    ],
  },
  {
    label: 'Plan your situation',
    accentBorder: 'border-l-skin-info',
    accentText: 'text-skin-info',
    items: [
      {text: 'When can I actually retire?', icon: 'plan'},
      {text: 'Should I kill debt or invest first?', icon: 'debt'},
      {text: 'Which account should I fund next?', icon: 'cashReserve'},
    ],
  },
]
</script>
