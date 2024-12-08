<template>
  <div>
    <!-- Navbar -->
    <!--    <LayoutTheNavbar/>-->

    <div class="grid grid-cols-6 gap-6">
      <!-- Left Sidebar -->
      <LayoutTheLeftSidebar class="col-span-1"/>

      <!-- Main Content -->
      <main class="flex-grow mx-auto container p-16 bg-skin-surface shadow-md rounded-md space-y-12 col-span-4">
        <slot/>
      </main>

      <!-- Left Sidebar -->
      <LayoutTheRightSidebar class="col-span-1"/>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>