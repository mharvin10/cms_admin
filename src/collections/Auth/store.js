import Vue from 'vue'

export const Auth = {
  // namespaced: true,
  state: {
    token: ''
  },
  mutations: {
    SET_TOKEN (state) {
      state.token = Vue.cookies.get('token')
    }
  }
}
