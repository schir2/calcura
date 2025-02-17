<template>
  <div class="space-y-2">
    <client-only>
      <effects-blur-reveal>
        <n-card class="opacity-85" v-if="isAuthenticated" size="huge">
          <h1 class="text-4xl mb-4">Welcome Back
            <span v-if="user">
        <span v-if="user.first_name">{{ user.first_name }}</span> <span
                v-if="user.last_name">{{ user.last_name }}</span></span></h1>
          <n-button size="large" type="primary" @click="$router.push('/dashboard')">My Dashboard</n-button>

        </n-card>
        <n-card class="opacity-85" v-else size="huge">
          <h1 class="text-4xl mb-4">Plan Your Retirement Smarter with <span class="brand">Calcura</span></h1>
          <p class="text-xl font-light mb-4">
            An intuitive, data-driven retirement calculator that helps you optimize savings, investments, and tax
            strategies—no guesswork needed.
          </p>
          <div class="flex gap-2">
            <n-button type="primary" size="large" strong @click="handleStartNow">
              Get Started
            </n-button>
            <n-button type="default" size="large" ghost @click="handleLearnMore">
              Learn More
            </n-button>
          </div>
        </n-card>
      </effects-blur-reveal>
    </client-only>
    <section class="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
      <n-card class="opacity-85" size="medium">
        <template #header>
          Educational Articles
        </template>
      </n-card>
      <n-card class="opacity-85" size="medium">
        <template #header>
          FAQ
        </template>
      </n-card>
      <n-card class="opacity-85" size="medium">
        <template #header>
          Calcura Academy
        </template>
      </n-card>
      <n-card class="opacity-85" size="medium">
        <template #header>
          Updates
        </template>
      </n-card>
      <n-card class="opacity-85" size="medium">
        <template #header>
          Latest Articles
        </template>
      </n-card>
    </section>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: 'landing',
  title: 'Home',
})

const router = useRouter()
const {isAuthenticated, user} = useAuthStore()

function handleStartNow() {
  router.push({path: "/auth/register"});
}

function handleLearnMore() {
  router.push({path: "/learn-more"})
}

</script>