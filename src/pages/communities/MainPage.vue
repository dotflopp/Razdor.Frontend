<template>
  <div class="app-container">
    <!-- Боковая панель с сообществами -->
    <CommunitySidebar></CommunitySidebar>
    <!-- Бовокая панель с каналами -->
    <div class="sidebar">
      <div class="main-content">
        <ChannelSidebar></ChannelSidebar>
      </div>
      <div class="profile">
        <ProfileCard></ProfileCard>
      </div>
    </div>

    <!-- Основная часть приложения -->
    <main class="main-content">
      <MainPageHeader></MainPageHeader>
      <Chat></Chat>
    </main>
    <div class="community-member">
      <MembersSidebar></MembersSidebar>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileCard from '@/features/profile/ProfileCard.vue'
import CommunitySidebar from '@/widgets/sidebars/CommunitySidebar.vue'
import ChannelSidebar from '@/widgets/sidebars/ChannelSidebar.vue'
import MainPageHeader from '@/widgets/header.vue/MainPageHeader.vue'
import Chat from '@/widgets/chat/Chat.vue'
import MembersSidebar from '@/widgets/sidebars/MembersSidebar.vue'

</script>

<style>
/* Общая структура */
.app-container {
  display: flex;
  height: 100vh;
  background-color: #36393f;
  color: white;
  font-family: Arial, sans-serif;
}

/* Боковая панель */
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  background-color: #2f3136;
}


/* Основная часть */
.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}


</style>