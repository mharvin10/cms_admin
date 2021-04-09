import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/collections/Auth/components/Login'
import MainLayout from '@/components/layouts/MainLayout'
import Home from '@/components/Home'

import Users from '@/collections/Users/components/Users'
import PageNodes from '@/components/webpages/PageNodes'
import MainMenus from '@/components/navigations/MainMenus'
import Links from '@/components/navigations/Links'
import News from '@/components/news/News'
import Announcements from '@/components/announcements/Announcements'
import JobVacancies from '@/components/job_vacancies/JobVacancies'
import Carousel from '@/components/carousel/Carousel'
import Calendar from '@/components/calendar/Calendar'
import Albums from '@/components/albums/Albums'
import AlbumPhotos from '@/components/albums/AlbumPhotos'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/webpages',
          name: 'Home',
          component: Home
        },
        {
          path: '/administrators',
          name: 'Users',
          component: Users
        },
        {
          path: '/webpages',
          name: 'Webpages',
          component: PageNodes
        },
        {
          path: '/main-menus',
          name: 'MainMenus',
          component: MainMenus
        },
        {
          path: '/links',
          name: 'Links',
          component: Links
        },
        {
          path: '/news',
          name: 'News',
          component: News
        },
        {
          path: '/announcements',
          name: 'Announcements',
          component: Announcements
        },
        {
          path: '/vacancies',
          name: 'JobVacancies',
          component: JobVacancies
        },
        {
          path: '/carousel',
          name: 'Carousel',
          component: Carousel
        },
        {
          path: '/calendar',
          name: 'Calendar',
          component: Calendar
        },
        {
          path: '/albums',
          name: 'Albums',
          component: Albums
        },
        {
          path: '/album/:album/photos',
          name: 'AlbumPhotos',
          component: AlbumPhotos
        }
      ]
    }
  ],
  mode: 'history'
})
