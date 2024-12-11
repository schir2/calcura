<script setup lang="ts">

const menu = ref({open: false})

const themeStore = useThemeStore()

const toggleMenu = () => {
  menu.value.open = !menu.value.open;
}
</script>

<template>
  <nav class="bg-skin-surface fixed top-0 z-50 shadow-md h-16 w-full flex justify-center items-center px-4 sm:px-8 lg:px-16">
    <NButton
        class="sm:hidden text-skin-secondary/80 hover:text-skin-secondary font-normal ease-in-out duration-500 transition-all"
        @click="toggleMenu"
    >
      <Icon name="uil:book"/>
    </NButton>
    <div class="flex w-full justify-between items-center container space-x-3">
      <div class="flex-1 space-x-3 items-center hidden sm:flex">
        <NButton>
          <NuxtLink to="/">Home</NuxtLink>
        </NButton>
        <NButton>
          <NuxtLink to="/plans">Plans</NuxtLink>
        </NButton>
      </div>
      <nav class="hidden sm:block">
        <NButton>Logout</NButton>
      </nav>
      <nav class="flex items-center space-x-3">
        <NButton circle tertiary @click="themeStore.toggleTheme()">
          <TransitionGroup
              name="icon-spin"
              tag="div"
              class="inline-block"
          >
            <Icon name="uil:sun" class="animate__animated animate__rotateIn text-yellow-500 text-xl" v-if="themeStore.theme === 'dark'"/>
            <Icon name="uil:moon" class="animate__animated animate__rotateIn text-purple-500 text-xl" v-if="themeStore.theme === 'light'"/>
          </TransitionGroup>
        </NButton>
      </nav>
      <div v-show="menu.open"
           class="absolute top-16 left-0 w-full bg-skin-surface shadow-md sm:hidden flex flex-col items-start space-y-2 p-4"
           @click.self="menu.open = false">
        <span>responsive</span>
      </div>
    </div>
  </nav>
</template>
<style scoped>
/* Scoped styles for transition-group */
.icon-spin-enter-active,
.icon-spin-leave-active {
  animation-duration: 1s;
}

.icon-spin-enter,
.icon-spin-leave-to {
  /* Keep the element hidden initially */
  display: none;
}
</style>