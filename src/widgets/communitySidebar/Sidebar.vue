<template>
  <div class="sidebar-communities">
    <ul class="community-list">
      <li
        v-for="community in communities"
        :key="community.id"
        class="community-item"
        :class="{ active: community.id === activeCommunityId }"
        @click="setActiveCommunity(community.id)"
      >
        <div class="community-avatar">
          <Avatar v-if="community.avatar" :info="{avatar: community.avatar ,name: community.name}"/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { communityStore } from '@/entities/store/community'
import Avatar from '@/features/avatar/Avatar.vue'


const commStore = communityStore()


const communities = computed(() => commStore.communities)
const activeCommunityId = computed(() => commStore.activeCommunityId)


function setActiveCommunity(id: string) {
  commStore.setActiveCommunity(id)
}

</script>

<style scoped>
.sidebar-communities {
  width:60px;
  background-color: #1d1f20;
  border-bottom: 1px solid #444;
}

.community-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.community-item {
  cursor: pointer;
  padding: 8px;
  transition: background-color 0.2s ease;
}

.community-item:hover,
.community-item.active {
  background-color: #3a3d44;
  border-radius: 5px;
}

.community-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #5865f2;
}

.community-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.initials {
  font-weight: bold;
  color: white;
}
</style>