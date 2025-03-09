<script setup lang="ts">
import type {UserProfile} from "~/types/UserProfile";

interface Props {
  profile: UserProfile
}

const props = defineProps<Props>()
</script>
<template>
  <n-card size="large">
    <template #header>
      <h2 class="text-2xl mb-2">My Profile</h2>
      <dashboard-profile-progress :profile/>
    </template>
  </n-card>
</template>