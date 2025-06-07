<template>
  <transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
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
}>()

const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Анимация fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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