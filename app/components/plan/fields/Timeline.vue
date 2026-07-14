<script lang="ts" setup>
import type {GrowthApplicationStrategy} from '#shared/types/Plan'
import {
  MAX_AGE,
  MAX_RETIREMENT_LIFE_EXPECTANCY,
  MIN_AGE,
  MIN_RETIREMENT_LIFE_EXPECTANCY,
  SLIDER_YEAR_MAX,
  SLIDER_YEAR_MIN,
} from '~/constants/planConstants'

const modelRef = defineModel<Partial<Plan>>({required: true})

const GROWTH_APPLICATION_OPTIONS: {label: string; value: GrowthApplicationStrategy}[] = [
  {label: 'Start of year', value: 'start'},
  {label: 'End of year', value: 'end'},
]
</script>

<template>
  <n-form-item path="age" label="Age" :show-feedback="false" class="!mb-3">
    <base-number-slider v-model="modelRef.age" :min="MIN_AGE" :max="MAX_AGE" :step="1"/>
  </n-form-item>

  <n-form-item path="year" label="Starting year" :show-feedback="false" class="!mb-1">
    <base-number-slider v-model="modelRef.year" :min="SLIDER_YEAR_MIN" :max="SLIDER_YEAR_MAX" :step="1"/>
  </n-form-item>
  <p class="text-xs text-skin-muted mb-3">
    The year this plan starts from. Contribution and tax limits are looked up against it, so it
    stays put rather than following the calendar.
  </p>

  <n-form-item path="life_expectancy" label="Life expectancy" :show-feedback="false" class="!mb-3">
    <base-number-slider
        v-model="modelRef.life_expectancy"
        :min="MIN_RETIREMENT_LIFE_EXPECTANCY"
        :max="MAX_RETIREMENT_LIFE_EXPECTANCY"
        :step="1"/>
  </n-form-item>

  <n-form-item path="growth_application_strategy" label="Apply growth" :show-feedback="false">
    <n-radio-group v-model:value="modelRef.growth_application_strategy">
      <n-radio-button
          v-for="option in GROWTH_APPLICATION_OPTIONS"
          :key="option.value"
          :label="option.label"
          :value="option.value"/>
    </n-radio-group>
  </n-form-item>
</template>
