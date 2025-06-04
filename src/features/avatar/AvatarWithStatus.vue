<template>
    <!-- Аватар + индикатор -->
    <div class="avatar-container">
      <Avatar :name="name" :avatar="avatar" 
        class="profile-avatar"
      />
      <!-- Индикатор статуса -->
      <span 
        class="status-dot"
        :class="[
          selectedStatus === 'Online' ? 'online' :
          selectedStatus === 'DoNotDisturb' ? 'dnd' : 'invisible'
        ]"
      ></span>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Avatar from '@/features/avatar/Avatar.vue'

// Пользователь из props
const props = defineProps<{
  avatar: string,
  name: string,
  status: string
}>()


const avatar = computed<string>(() => props.avatar!)
const name = computed<string>(() =>  props.name!)
const selectedStatus = computed<string>(() => props.status!)

</script>

<style scoped>
.avatar-container {
  position: relative;
  display: inline-block;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  object-fit: cover;
}

.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #2f3136;
  box-sizing: border-box;
}

.status-dot.online {
  background-color: #43b581;
}

.status-dot.dnd {
  background-color: #f04747;
}

.status-dot.invisible {
  background-color: #5e646c;
}
</style>
