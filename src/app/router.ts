import { createRouter, createWebHistory } from 'vue-router'
import { userStore } from '@/entities/store/user'
import { communityStore } from '@/entities/store/community'

//инициализируем точки перехода 
const loginPage = () => import('@/pages/auth/LoginPage.vue')
const signUpPage = () => import('@/pages/auth/SignUpPage.vue')
const homePage = () => import('@/pages/home')
const roomPage = () => import('@/pages/testRooms/RoomsPage.vue')
const mainPage = () => import('@/pages/communities/MainPage.vue')
const inviteHandlerPage = () => import('@/pages/invite/InviteНandlerPage.vue')
const acceptInvitationPage = () => import('@/pages/invite/AcceptInvitation.vue')

//прописываем массив свойств роутера
const routes = [
  { 
    path: '', 
    redirect: '/main'
  },
  { 
    path: '/login', 
    component: loginPage, 
    meta: { 
      auth: false,
    } 
  },
  { 
    path: '/signup',
    component: signUpPage, 
    meta: { 
      auth: false,
    } 
  },
  { 
    path: '/rooms', 
    component: roomPage, 
    meta: { 
      auth: true
    } 
  },
  { 
    path: '/main', 
    component: mainPage,
    meta: { 
      auth: true,
      needUser: true,
      needCommunity: true,
      needInviteRedirect:true
    } 
  },
  { 
    path: '/invite/:id', 
    component: inviteHandlerPage,
    meta: { 
      auth: false
    } 
  },
  { 
    path: '/acceptinvite', 
    component: acceptInvitationPage,
    meta: { 
      auth: true,
    } 
  }
]

//создаем сам роутер
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Глобальный хук для проверки аутентификации
router.beforeEach(async (to, from, next) => {
  //данные для работы роутера 
  const uStore = userStore()
  const commStore = communityStore()
  const isAuthenticated = uStore.isAuthenticated; 
  const isUserLoaded = (uStore.currentUser != null)
  const isCommunityLoaded = (commStore.communities != null)

  if(to.meta.needInviteRedirect && commStore.getInviteID != null) {
    return next('/acceptinvite')
  } 

  if (to.meta.auth && !isAuthenticated) {
    return next('/login')
  }
  if (to.meta.needUser && !isUserLoaded) {
    try {
      await uStore.fetchCurrentUser()
    } catch (error) {
      return next('/login')
    }
  }
  if (to.meta.needCommunity && !isCommunityLoaded) {
    try {
      await commStore.fetchCommunities()
    } catch (error) {
      console.error('Ошибка загрузки сообществ:', error)
    }
  }
  if (to.meta.needInviteInfo) {
    try {
      await commStore.fetchInviteInfo(commStore.getInviteID!)
    } catch (error) {
      console.error('Ошибка получения данных приглашения:', error)
    }
  }

  // 4. Перейти дальше
  next()
});

export default router