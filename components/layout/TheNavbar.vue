<script setup lang="ts">

const menu = ref({open: false, isSpinning: false,})

const themeStore = useThemeStore()

const toggleMenu = () => {
  menu.value.open = !menu.value.open;
  menu.value.isSpinning = true;
  setTimeout(() => {
    menu.value.isSpinning = false;
  }, 500);
};
</script>

<template>
  <nav class="bg-skin-surface fixed top-0 z-50 shadow-md h-16 w-full flex justify-center items-center px-4 sm:px-8 lg:px-16">
    <button
        class="sm:hidden text-skin-secondary/80 hover:text-skin-secondary font-normal ease-in-out duration-500 transition-all"
        @click="toggleMenu"
    >
      <MenuIcon/>
    </button>

    <!-- Container for responsive flex layout -->
    <div class="flex w-full justify-between items-center container space-x-3">

      <!-- Left section with navbar items, hidden by default on mobile -->
      <div class="flex-1 space-x-3 items-center hidden sm:flex">
        <span>Links</span>
      </div>

      <!-- Middle section for centered items, hidden by default on mobile -->
      <div class="hidden sm:block">
        <span>middle</span>
      </div>

      <!-- Right section with icons and other nav items -->
      <div class="flex items-center space-x-3">
        <CommonButton @click="themeStore.toggleTheme()">
          <SunIcon class="text-yellow-500" v-if="themeStore.theme === 'dark'"/>
          <MoonIcon class="text-purple-500" v-if="themeStore.theme === 'light'"/>
        </CommonButton>
      </div>

      <!-- Mobile Menu - visible when toggled open -->
      <div v-show="menu.open"
           class="absolute top-16 left-0 w-full bg-skin-surface shadow-md sm:hidden flex flex-col items-start space-y-2 p-4"
           @click.self="menu.open = false">
        <span>responsive</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.spin-fast {
  animation: spin-multiple 0.5s ease-in-out
}
</style>