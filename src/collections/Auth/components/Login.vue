<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar flat>
              <v-toolbar-title>Please login</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-progress-linear height="3" :indeterminate="true" class="ma-0" v-if="$store.state.loading"></v-progress-linear>
            <v-card-text>
              <v-form v-model="form.valid" ref="LoginForm" lazy-validation>
                <v-alert light :value="error" color="warning" icon="priority_high" transition="slide-x-transition">
                  {{error}}
                </v-alert>
                <v-text-field
                  prepend-icon="person"
                  type="text"
                  v-model="form.username"
                  label="Username"
                  :rules="formRules.username"
                  required
                ></v-text-field>
                <v-text-field
                  prepend-icon="lock"
                  type="password"
                  v-model="form.password"
                  label="Password"
                  :rules="formRules.password"
                  :append-icon="form.showPassword ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (form.showPassword = !form.showPassword)"
                  :type="form.showPassword ? 'text' : 'password'"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="!form.valid" @click="loginBtnClicked">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import { clientId, clientSecret } from '@/env'

  export default {
    beforeRouteEnter (to, from, next) {
      next(vm => {
        console.log(from)
        vm.from = from.fullPath
        if (vm.$auth.check()) {
          next({
            path: '/'
          })
        }
      })
    },
    data () {
      return {
        form: this.initForm(),
        formRules: {
          username: [
            (v) => !!v || 'Username is required'
          ],
          password: [
            (v) => !!v || 'Password is required'
          ]
        },
        error: '',
        from: '/',
        alert: false
      }
    },
    watch: {
      errors: function () {
        if (this.errors) {
          this.alert = true
        }
      }
    },
    methods: {
      loginBtnClicked () {
        // this.clearErrorsFn()
        if (this.$refs.LoginForm.validate()) {
          this.axios.post('/oauth/token', {
            grant_type: 'password',
            client_id: clientId,
            client_secret: clientSecret,
            username: this.form.username,
            password: this.form.password
          })
          .then(response => {
            this.$auth.setToken(response.data.access_token, response.data.expires_in + Date.now())
            this.form = this.initForm()
            this.error = false
            location.href = this.$route.query.redirect === undefined ? '/' : this.$route.query.redirect
          })
          // .then(response => {
          //   this.axios.get('/api/auth/user', {
          //     headers: {
          //       'Authorization': 'Bearer ' + this.$auth.getToken()
          //     }
          //   })
          //   .then(response => {
          //     this.$auth.setUser(response.data)
          //     location.href = this.$route.query.redirect === undefined ? '/' : this.$route.query.redirect
          //   })
          //   .catch(error => {
          //     console.log(error.response.data)
          //   })
          //   this.$store.commit('HIDE_PROGRESS_BAR')
          // })
          .catch(error => {
            console.log(error)
            if (error.response === undefined) {
              this.error = 'Server is not responding. Please try again later.'
            } else if (error.response.status === 401) {
              this.error = 'Authentication failed. You entered an incorrect username or password.'
            } else if (error.response.status === 500 && error.response.data === 'precondition_failed_suspended') {
              this.error = 'Account disabled. It looked like this account has been suspended. Please contact you administrator.'
            } else {
              this.error = 'Authentication failed. Please provide the neccessary information.'
            }
            this.$store.commit('HIDE_LOADING_SCREEN')
          })
        }
      },
      initForm () {
        return {
          valid: false,
          username: '',
          password: '',
          showPassword: false
        }
      }
    }
  }
</script>
