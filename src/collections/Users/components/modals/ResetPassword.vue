<template>
  <v-dialog v-model="props.show" width="370px" persistent scrollable>
    <v-card class="card--flex-toolbar">
      <v-toolbar flat>
        <v-card-title class="grey lighten-4 title ma-0">
          Reset Password
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="props.show = !props.show">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text style="height: 220px;">
        <v-container grid-list-md> 
          <v-layout fill-height row wrap>
            <v-flex xs12 fill-height>
              <v-form v-model="form.valid" ref="ResetPasswordForm">

                <v-layout row wrap>
                  <v-flex xs12 md10>
                    <v-text-field
                      label="Enter your new password"
                      hint="At least 8 characters"
                      v-model="form.data.password"
                      type="password"
                      :error-messages="form.errors.password"
                    ></v-text-field>   
                  </v-flex>
                </v-layout>

                <v-layout row wrap>
                  <v-flex xs12 md10>
                    <v-text-field
                      label="Repeat your password"
                      v-model="form.data.retype_password"
                      type="password"
                      :error-messages="form.errors.retype_password"
                    ></v-text-field>    
                  </v-flex>
                </v-layout>

              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="props.show = !props.show">Cancel</v-btn>
        <v-btn flat color="primary" @click="reset(props.data.id)" :disabled="!form.valid">Reset</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      props: Object
    },
    data () {
      return {
        form: {
          valid: true,
          data: this.initFormData(),
          errors: []
        }
      }
    },
    watch: {
      'props.show': {
        handler (show) {
          if (!show) {
            this.form.errors = []
            this.form.valid = true
            this.form.data = this.initFormData()
            this.props.data = {}
          }
        }
      }
    },
    methods: {
      initFormData () {
        return {
          password: '',
          retype_password: ''
        }
      },
      reset (userId) {
        this.axios.patch('/admin/user/' + userId + '/reset-password', this.form.data)
          .then(response => {
            this.props.show = false
            this.$emit('passwordReseted')
          })
          .catch(error => {
            console.log(error.response.data)
            this.form.errors = error.response.data.errors
          })
      }
    }
  }
</script>