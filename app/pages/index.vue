<!-- Landing page. Logged-in users see "Welcome Back"; append ?preview to view the landing while logged in. -->
<template>
  <div>
    <client-only>
      <!-- Authenticated branch -->
      <n-card class="opacity-85" v-if="isAuthenticated && !preview" size="huge">
        <h1 class="text-4xl mb-4">Welcome Back
          <span v-if="user">
            <span v-if="user.first_name">{{ user.first_name }}</span>
            <span v-if="user.last_name">{{ user.last_name }}</span>
          </span>
        </h1>
        <n-button size="large" type="primary" @click="$router.push('/dashboard')">My Dashboard</n-button>
      </n-card>

      <!-- Landing -->
      <LandingPage v-else />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import LandingPage from '~/components/landing/LandingPage.vue'

definePageMeta({
  layout: 'landing',
  title: 'Home',
})

const user = useSupabaseUser()
const {isAuthenticated} = useAuth()
const route = useRoute()

const preview = computed(() => route.query.preview !== undefined)
</script>
