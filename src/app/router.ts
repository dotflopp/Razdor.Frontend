import { createRouter, createWebHistory } from 'vue-router'
import { userStore } from '@/entities/store/user'
import { communityStore } from '@/entities/store/community'

//инициализируем точки перехода 
const loginPage = () => import('@/pages/auth/LoginPage.vue')
const signUpPage = () => import('@/pages/auth/SignUpPage.vue')
const homePage = () => import('@/pages/home')
const roomPage = () => import('@/pages/testRooms/RoomsPage.vue')
const mainPage = () => import('@/pages/communities/MainPage.vue')
const addPage = () => import('@/pages/communities/AddPage.vue')
//прописываем массив свойств роутера
const routes = [
  { 
    path: '', 
    component: homePage
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
      needCommunity: true
    } 
  },
  { 
    path: '/add', 
    component: addPage,
    meta: { 
      auth: true
    } 
  },
  { 
    path: '/profile', 
    component: addPage,
    meta: { 
      auth: true
    } 
  },
]

//создаем сам роутер
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Глобальный хук для проверки аутентификации
router.beforeEach(async (to, from, next) => {
  const uStore = userStore()
  const commStore = communityStore()
  const isAuthenticated = uStore.isAuthenticated; 
  const isUserLoaded = (uStore.currentUser != null)
  const isCommunityLoaded = (commStore.communities != null)
  //проверка на аунтефикацию
  if (to.meta.auth && !isAuthenticated) {
    next('/login');
  } 
  else {
    next(); 
  }

  //проверка на загруженного пользователя
  if(to.meta.needUser && !isUserLoaded) {
    try {
      await uStore.fetchCurrentUser()
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error)
      next('/login') // Перенаправляем на логин
    }
  } else {
    next()
  }
  //проверка на загруженные community
  if(to.meta.needCommunity && !isCommunityLoaded) {
    try {
      await commStore.fetchCommunities()
    } catch (error) {
      console.error('Ошибка загрузки сообщества:', error)
    }
  } else {
    next()
  }
});

export default router