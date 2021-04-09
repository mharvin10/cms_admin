// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import axiosRetry from 'axios-retry'
import App from './App'
import store from './store'
import router from './router'
import VueCookie from 'vue-cookie'
import Auth from '@/collections/auth/Auth'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VDataTable,
  VToolbar,
  transitions,
  VForm,
  VTextField,
  VCheckbox,
  VDivider,
  VMenu,
  VToolTip,
  VDialog,
  VCard,
  VProgressLinear,
  VProgressCircular,
  VAlert,
  VAvatar,
  VBadge,
  VSubheader,
  VSelect,
  VBreadcrumbs,
  VDatePicker,
  VDataIterator
} from 'vuetify'

import '../node_modules/vuetify/src/stylus/app.styl'
import VueFroala from 'vue-froala-wysiwyg'

Vue.use(VueAxios, axios)
Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VDataTable,
    VToolbar,
    transitions,
    VForm,
    VTextField,
    VCheckbox,
    VDivider,
    VMenu,
    VToolTip,
    VDialog,
    VCard,
    VProgressLinear,
    VProgressCircular,
    VAlert,
    VAvatar,
    VBadge,
    VSubheader,
    VSelect,
    VBreadcrumbs,
    VDatePicker,
    VDataIterator
  },
  theme: store.state.theme
})

// Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min')

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
require('font-awesome/css/font-awesome.css')
require('froala-editor/css/froala_style.min.css')

Vue.use(VueCookie)
Vue.use(Auth)
Vue.use(VueFroala)

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!Vue.auth.check()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
    next()
  }
  next()
})

axios.defaults.baseURL = store.state.api.baseUrl
axios.defaults.headers.common['Authorization'] = 'Bearer ' + Vue.auth.getToken()
axios.interceptors.request.use(function (config) {
  if (config.method !== 'get') {
    store.commit('SHOW_LOADING_SCREEN')
  }
  return config
}, function (error) {
  console.log('error')
  store.commit('HIDE_LOADING_SCREEN')
  return Promise.reject(error)
})
axios.interceptors.response.use(function (response) {
  store.commit('HIDE_LOADING_SCREEN')
  return response
}, function (error) {
  if (error.response.status === 401) {
    Vue.auth.logout()
    // router.push('/login')
  }
  store.commit('HIDE_LOADING_SCREEN')
  return Promise.reject(error)
})
axiosRetry(axios, { retries: 3 })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
