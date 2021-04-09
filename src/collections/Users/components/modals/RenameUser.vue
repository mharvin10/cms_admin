<template>
  <v-dialog v-model="props.show" width="400px" persistent scrollable>
    <v-card class="card--flex-toolbar">
      <v-toolbar flat>
        <v-card-title class="grey lighten-4 title ma-0">
          Rename User
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="props.show = !props.show">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text style="height: 300px;">
        <v-container grid-list-md> 
          <v-layout fill-height row wrap>
            <v-flex xs12 fill-height>
              <v-form v-model="form.valid" ref="RenameUserForm">

                <v-layout row wrap>
                  <v-flex xs12 md10>
                    <v-text-field
                      label="Name"
                      hint="Complete name"
                      persistent-hint
                      v-model="form.data.name"
                      :error-messages="form.errors.name"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row wrap>
                  <v-flex xs12 md8>
                    <v-text-field
                      label="Username"
                      v-model="form.data.username"
                      :error-messages="form.errors.username"
                      readonly
                      disabled
                    ></v-text-field>    
                  </v-flex>
                </v-layout>

                <v-layout row wrap>
                  <v-flex xs12 md10>
                    <v-text-field
                      label="Email"
                      v-model="form.data.email"
                      :error-messages="form.errors.email"
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
        <v-btn flat color="primary" @click="rename(props.data.id)" :disabled="!form.valid">Rename</v-btn>
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
      'props.data': {
        handler (data) {
          this.form.data = {
            name: data.name ? data.name : '',
            username: data.username,
            email: data.email
          }
        },
        deep: true
      },
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
          name: '',
          username: '',
          email: ''
        }
      },
      rename (userId) {
        this.axios.patch('/admin/user/' + userId + '/rename', this.form.data)
          .then(response => {
            // console.log(response.data)
            this.props.show = false
            this.$emit('userRenamed')
          })
          .catch(error => {
            console.log(error.response.data)
            this.form.errors = error.response.data.errors
          })
      }
    }
  }
</script>