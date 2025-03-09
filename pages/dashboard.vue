<template>
  <div class="content-grid space-y-8">
    <h1 class="full-width text-6xl text-center">Calcura Dashboard</h1>
    <client-only><p class="content text-lg text-center">{{ currentDateTimeString }}</p></client-only>
    <p class="content text-lg text-center">Welcome back {{ user?.email }}</p>
    <div class="breakout grid grid-cols-2 gap-2">
      <dashboard-plans :plans="plans"/>
      <dashboard-profile :profile="profile" />
    </div>
  </div>
</template>
<script lang="ts" setup>

import type {Plan} from "~/types/Plan";

definePageMeta({
      title: 'Dashboard',
      layout: 'default',
    }
)
const {data: plans, refresh} = useFetch<Plan[]>('api/plans')
const {user, profile} = storeToRefs(useAuthStore())
const {currentDateTimeString} = storeToRefs(useCurrentTime())

</script>
<style scoped>
.content-grid {
  --padding-inline: 1rem;
  --content-max-width: 900px;
  --breakout-max-width: 1200px;

  --breakout-size: calc(
      (var(--breakout-max-width) - var(--content-max-width)) / 2
  );

  display: grid;
  grid-template-columns:
    [full-width-start] minmax(var(--padding-inline), 1fr)
    [breakout-start] minmax(0, var(--breakout-size))
    [content-start] min(
      100% - (var(--padding-inline) * 2),
      var(--content-max-width)
    )
    [content-end]
    minmax(0, var(--breakout-size)) [breakout-end]
    minmax(var(--padding-inline), 1fr) [full-width-end];
}

.content-grid > .content {
  grid-column: content;
}

.content-grid > .breakout {
  grid-column: breakout;
}

.content-grid > .full-width {
  grid-column: full-width;
}
</style>
