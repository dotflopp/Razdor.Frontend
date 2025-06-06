<template>
  <div class="sidebar-users">
    <div class="top-bar">

    </div>
    <ul class="user-list">
      <li
        v-for="member in commMembers" :key="member.userId" class="user-item"
      >
        <div class="user-avatar">
          <AvatarWithStatus :name="member.nickname" :avatar="member.avatar!" :status="member.status" />
        </div>
        <span class="user-name">{{ member.nickname }}</span>
      </li>
    </ul>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RestApiClient } from '@/entities/api/apiClient'
import { communityStore } from '@/entities/store/community'
import AvatarWithStatus from '@/features/avatar/AvatarWithStatus.vue'

const api = new RestApiClient('https://dotflopp.ru/api') 
const commStore = communityStore()


const commMembers = computed(() => commStore.getCommunityMembers)

</script>

<style scoped>
.top-bar {
  flex-shrink: 0;
  background-color:#282a2d;
  height: 50px;
}
.sidebar-users {
  background-color: #2f3136;
  display: flex;
  flex-direction: column;
  height: 100%;
  width:160px;
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  padding: 8px 16px;
  transition: background-color 0.2s ease;
}

.user-item:hover,
.user-item.active {
  background-color: #282a2d;
}

.user-avatar {
  width: 36px;
  height: 36px;
}

.user-name {
  color: white;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>