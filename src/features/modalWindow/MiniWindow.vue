<template>
  <transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="closeModal" :style="modalStyle">
      <transition name="slide">
        <slot></slot>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  show: boolean
  modalStyle?: Record<string, any>
}>()

const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Анимация slide */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>