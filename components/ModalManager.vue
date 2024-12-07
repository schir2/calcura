<template>
  <Modal
      v-if="currentModal"
      :isOpen="true"
      :title="currentModal.title"
      @close="closeModal"
  >
    <template #header>
      <h2>{{ currentModal.header }}</h2>
    </template>
    <template>
      <component :is="currentModal.component" v-bind="currentModal.props" />
    </template>
    <template #footer>
      <slot name="footer" v-bind="currentModal.props" />
      <button @click="closeModal">Close</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Define the shape of a modal configuration
interface ModalConfig {
  title: string;
  header?: string;
  component: any;
  props?: Record<string, any>;
}

const currentModal = ref<ModalConfig | null>(null);

export function openModal(modalConfig: ModalConfig) {
  currentModal.value = modalConfig;
}

export function closeModal() {
  currentModal.value = null;
}
</script>
