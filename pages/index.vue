<template>
  <n-card size="huge">
    <h1 class="text-4xl mb-4">Plan Your Retirement Smarter with <span class="brand">Calcura</span></h1>
    <p class="text-xl font-light mb-4">
      An intuitive, data-driven retirement calculator that helps you optimize savings, investments, and tax
      strategies—no guesswork needed.
    </p>
    <n-space>
      <n-button type="primary" size="large" strong @click="handleStartNow">
        Get Started for Free
      </n-button>
      <n-button type="default" size="large" ghost @click="handleLearnMore">
        Learn More
      </n-button>
    </n-space>
  </n-card>
</template>
<script lang="ts" setup>
const router = useRouter()
function handleStartNow() {
  router.push({ path: "/register" });
}

function handleLearnMore() {
  router.push({path: "/learn-more"})
}
</script>