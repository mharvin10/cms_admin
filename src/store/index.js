import Vue from 'vue'
import Vuex from 'vuex'

import colors from 'vuetify/es5/util/colors'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    loading: false,
    progress: false,
    api: {
      // baseUrl: 'http://api.basud.test/'
      baseUrl: 'http://api.basud.gov.ph/'
    },
    theme: {
      primary: colors.amber.lighten2,
      secondary: colors.red.accent1,
      accent: colors.shades.black,
      error: colors.red.accent1,
      info: '#2196F3',
      success: '#4CAF50',
      warning: colors.orange.lighten3
    },
    style: {
      text: {
        color: {
          default: 'grey--text text--darken-3',
          active: 'primary--text',
          disabled: 'grey--text text--lighten-2',
          formLabel: 'grey--text text--darken-1'
        }
      }
    }
  },
  getters: {
    locationOrigin () {
      return window.location.origin
    }
  },
  mutations: {
    SHOW_LOADING_SCREEN (state) {
      state.loading = true
    },
    HIDE_LOADING_SCREEN (state) {
      state.loading = false
    },
    SHOW_PROGRESS_BAR (state) {
      state.progress = true
    },
    HIDE_PROGRESS_BAR (state) {
      state.progress = false
    }
  },
  modules: {}
})

export default store
