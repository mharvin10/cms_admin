<template>
  <v-dialog v-model="props.show" width="400px" persistent scrollable>
    <v-card class="card--flex-toolbar">
      <v-toolbar flat>
        <v-card-title class="grey lighten-4 title ma-0">
          Assign Components
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="props.show = !props.show">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text style="height: 450px;">
        <v-container grid-list-md> 
          <v-layout fill-height row wrap>
            <v-flex xs12 fill-height>
              <v-form v-model="form.valid" ref="AssignComponentsForm">

                <v-layout align-center class="mt-2 ml-2">
                  <v-checkbox
                    v-model="form.data.userComponents"
                    value="administrators"
                    color="primary"
                    hide-details 
                    class="shrink mr-2"
                  ></v-checkbox>
                  <span>Administrators</span>
                </v-layout>

                <v-layout align-center class="mt-2 ml-2">
                  <v-checkbox
                    v-model="form.data.userComponents"
                    value="webpages"
                    color="primary"
                    hide-details 
                    class="shrink mr-2"
                  ></v-checkbox>
                  <span>Webpages</span>
                </v-layout>

                <v-layout align-center class="mt-2 ml-2">
                  <v-checkbox
                    v-model="form.data.userComponents"
                    value="main_menu"
                    color="primary"
                    hide-details 
                    class="shrink mr-2"
                  ></v-checkbox>
                  <span>Main menu</span>
                </v-layout>

                <v-layout align-center class="mt-2 ml-2">
                  <v-checkbox
                    v-model="form.data.userComponents"
                    value="links"
                    color="primary"
                    hide-details 
                    class="shrink mr-2"
                  ></v-checkbox>
                  <span>Links</span>
                </v-layout>

                <v-layout align-center class="mt-2 ml-2">
                  <v-checkbox
                    v-model="form.data.userComponents"
                    value="news"
                    color="primary"
                    hide-details 
                    class="shrink mr-2"
                  ></v-checkbox>
                  <span>News</span>
                </v-layout>

                <v-layout align-center class="mt-2 ml-2">
                  <v-checkbox
                    v-model="form.data.userComponents"
                    value="announcements"
                    color="primary"
                    hide-details 
                    class="shrink mr-2"
                  ></v-checkbox>
                  <span>Announcements</span>
                </v-layout>

                <v-layout align-center class="mt-2 ml-2">
                  <v-checkbox
                    v-model="form.data.userComponents"
                    value="job_vacancies"
                    color="primary"
                    hide-details 
                    class="shrink mr-2"
                  ></v-checkbox>
                  <span>Job Vacancies</span>
                </v-layout>

                <v-layout align-center class="mt-2 ml-2">
                  <v-checkbox
                    v-model="form.data.userComponents"
                    value="carousel"
                    color="primary"
                    hide-details 
                    class="shrink mr-2"
                  ></v-checkbox>
                  <span>Carousel</span>
                </v-layout>

                <v-layout align-center class="mt-2 ml-2">
                  <v-checkbox
                    v-model="form.data.userComponents"
                    value="calendar"
                    color="primary"
                    hide-details 
                    class="shrink mr-2"
                  ></v-checkbox>
                  <span>calendar</span>
                </v-layout>

                <v-layout align-center class="mt-2 ml-2">
                  <v-checkbox
                    v-model="form.data.userComponents"
                    value="albums"
                    color="primary"
                    hide-details 
                    class="shrink mr-2"
                  ></v-checkbox>
                  <span>Albums</span>
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
        <v-btn flat color="primary" @click="save(props.data.id)" :disabled="!form.valid">Save</v-btn>
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
            userComponents: data.components
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
          userComponents: []
        }
      },
      save (userId) {
        this.axios.patch('/admin/user/' + userId + '/components', this.form.data)
          .then(response => {
            // console.log(response.data)
            this.props.show = false
            this.$emit('componentsAssigned')
          })
          .catch(error => {
            console.log(error.response.data)
            this.form.errors = error.response.data.errors
          })
      }
    }
  }
</script>