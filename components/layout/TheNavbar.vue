<script setup lang="ts">

const menu = ref({open: false})

const themeStore = useThemeStore()

const toggleMenu = () => {
  menu.value.open = !menu.value.open;
}
</script>

<template>
  <nav class="bg-skin-surface fixed top-0 z-50 shadow-md h-16 w-full flex justify-center items-center px-4 sm:px-8 lg:px-16">
    <button
        class="sm:hidden text-skin-secondary/80 hover:text-skin-secondary font-normal ease-in-out duration-500 transition-all"
        @click="toggleMenu"
    >
      <MenuIcon/>
    </button>
    <div class="flex w-full justify-between items-center container space-x-3">
      <div class="flex-1 space-x-3 items-center hidden sm:flex">
        <span>Links</span>
      </div>
      <div class="hidden sm:block">
        <span>middle</span>
      </div>
      <div class="flex items-center space-x-3">
        <NButton @click="themeStore.toggleTheme()">
          <SunIcon class="text-yellow-500" v-if="themeStore.theme === 'dark'"/>
          <MoonIcon class="text-purple-500" v-if="themeStore.theme === 'light'"/>
        </NButton>
      </div>
      <div v-show="menu.open"
           class="absolute top-16 left-0 w-full bg-skin-surface shadow-md sm:hidden flex flex-col items-start space-y-2 p-4"
           @click.self="menu.open = false">
        <span>responsive</span>
      </div>
    </div>
  </nav>
</template>