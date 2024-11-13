<template>
  <div>
    <!-- Navbar -->
    <LayoutTheNavbar/>

    <div>
      <!-- Sidebar -->
      <LayoutTheSidebar/>

      <!-- Main Content -->
      <main class="flex-grow mx-auto container p-16 bg-skin-surface shadow-md rounded-md space-y-12">
        <slot/>
      </main>
    </div>
  </div>
</template>