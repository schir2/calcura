<template>
  <div>
    <!-- Navbar -->
    <LayoutTheNavbar/>

    <div class="layout-body">
      <!-- Sidebar -->
      <LayoutTheSidebar/>

      <!-- Main Content -->
      <main class="layout-content">
        <slot/>
      </main>
    </div>

    <!-- Footer (optional) -->
    <LayoutTheFooter/>
  </div>
</template>