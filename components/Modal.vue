<template>
  <teleport to="body">
    <div v-show="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <!-- Header Slot -->
        <header class="modal-header">
          <slot name="header">
            <h3>{{ title }}</h3> <!-- Default title if no slot provided -->
          </slot>
        </header>

        <!-- Content Slot -->
        <main class="modal-content">
          <slot>
            Default content
          </slot>
        </main>

        <!-- Footer Slot -->
        <footer class="modal-footer">
          <slot name="footer">
            <button @click="close">Close</button> <!-- Default footer if no slot provided -->
          </slot>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  isOpen: Boolean, // Controls visibility
  title: String,   // Optional title for the modal
});

const emit = defineEmits(['close']); // Emit close event to parent

function close() {
  emit('close');
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header,
.modal-footer {
  padding: 1rem;
  background: #f5f5f5;
}

.modal-content {
  padding: 1rem;
}
</style>
