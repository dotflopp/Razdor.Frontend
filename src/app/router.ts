import { createRouter, createWebHistory } from 'vue-router'

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
    meta: { auth: false } 
  },
  { 
    path: '/signup',
    component: signUpPage, 
    meta: { auth: false } 
  },
  { 
    path: '/rooms', 
    component: roomPage, 
    meta: { auth: false } 
  },
  { 
    path: '/main', 
    component: mainPage
  },
  { 
    path: '/add', 
    component: addPage
  },
]

//создаем сам роутер
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Глобальный хук для проверки аутентификации
router.beforeEach((to, from, next) => {
  const isAuthenticated = checkAuth(); 

  if (to.meta.auth && !isAuthenticated) {
    next('/login'); // Перенаправляем на страницу входа
  } else {
    next(); // Разрешаем переход
  }
});

function checkAuth() {
  // Пример проверки аутентификации (замените на реальную логику)
  //return localStorage.getItem('userToken') !== null;
  return false;
}


export default router
