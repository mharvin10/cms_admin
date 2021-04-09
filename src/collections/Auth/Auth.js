export default function (Vue) {
  Vue.auth = {
    setToken (token, expiration) {
      Vue.cookie.set('token', token, { expires: '9h' })
      Vue.cookie.set('expiration', expiration + Date.now(), { expires: '9h' })
      // localStorage.setItem('token', token)
      // localStorage.setItem('expiration', expiration)
    },
    getToken () {
      var token = Vue.cookie.get('token')
      var expiration = Vue.cookie.get('expiration')
      // var token = localStorage.getItem('token')
      // var expiration = localStorage.getItem('expiration')

      if (!token || !expiration) {
        return null
      }
      if (Date.now() > parseInt(expiration)) {
        this.destroyToken()
        return null
      } else {
        return token
      }
    },
    destroyToken () {
      Vue.cookie.delete('token')
      Vue.cookie.delete('expiration')
      // localStorage.removeItem('token')
      // localStorage.removeItem('expiration')
    },
    check () {
      if (this.getToken()) {
        return true
      } else {
        return false
      }
    },
    logout () {
      this.destroyToken()
    }
  }
  Object.defineProperties(Vue.prototype, {
    $auth: {
      get () {
        return Vue.auth
      }
    }
  })
}
