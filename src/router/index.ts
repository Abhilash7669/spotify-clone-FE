import AuthLayout from '@/components/layout/AuthLayout.vue'
import { AUTH_UTILS } from '@/utils/auth'
import ArtistDetailShowcaseView from '@/view/artist/ArtistDetailShowcaseView.vue'
import ArtistView from '@/view/artist/ArtistView.vue'
import CreatePlaylistView from '@/view/CreatePlaylistView.vue'
import DashboardView from '@/view/DashboardView.vue'
import HomeView from '@/view/HomeView.vue'
import LibraryView from '@/view/LibraryView.vue'
import LikedSongsView from '@/view/LikedSongsView.vue'
import LoginView from '@/view/LoginView.vue'
import PlaylistDetail from '@/view/playlist/PlaylistDetail.vue'
import PlaylistView from '@/view/playlist/PlaylistView.vue'
import SongView from '@/view/song/SongView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      children: [
        {
          path: '/login',
          component: LoginView,
        },
      ],
    },
    {
      path: '/protected',
      component: AuthLayout,
      children: [
        {
          path: 'home',
          component: HomeView,
          meta: { requiresAuth: true },
        },
        {
          path: 'dashboard',
          component: DashboardView,
          meta: { requiresAuth: true },
        },
        {
          path: 'songs',
          component: SongView,
          meta: { requiresAuth: true },
        },
        {
          path: 'library',
          component: LibraryView,
          meta: { requiresAuth: true },
        },
        {
          path: 'liked-songs',
          component: LikedSongsView,
          meta: { requiresAuth: true },
        },
        {
          path: 'create-playlist',
          component: CreatePlaylistView,
          meta: { requiresAuth: true },
        },
        {
          path: 'playlist',
          component: PlaylistView,
          meta: { requiresAuth: true },
        },
        {
          path: 'playlist/:id',
          component: PlaylistDetail,
          meta: { requiresAuth: true },
        },
        {
          path: 'artist/:id',
          component: ArtistView,
          meta: { requiresAuth: true },
        },
        {
          path: 'artist',
          component: ArtistDetailShowcaseView,
          meta: { requiresAuth: true },
        },
      ],
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = AUTH_UTILS.getToken()

  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    if (to.path === '/login' && token) {
      next('/protected/home')
    } else if (to.path === '/' && token) {
      next('/protected/home')
    } else if (to.path === '/' && !token) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
