<template>
  <transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
      <transition name="slide">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ title }}</h2>
            <button @click="closeModal" class="close-btn">&times;</button>
          </div>

          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  show: boolean
  title: string

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

.modal-content {
  background-color: #36393f;
  padding: 24px;
  border-radius: 8px;
  min-width: 30%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  opacity: 1;
  transform: translateY(0);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #ccc;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #fff;
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