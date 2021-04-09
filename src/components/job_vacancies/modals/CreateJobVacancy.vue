<template>
  <v-dialog v-model="props.show" fullscreen transition="dialog-bottom-transition" :overlay="false">
    <v-card flat>
      <v-toolbar dark color="primary" flat>
        <v-btn flat icon @click.native="props.show = !props.show">
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-toolbar-title>Job Vacancies</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat @click="save">
          Save
          <v-icon right dark>save</v-icon>
        </v-btn>
        <v-btn icon @click.native="props.show = !props.show">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-layout row wrap py-3>
        <v-flex xs12 lg8 offset-lg2>
          <!-- form -->
          <v-layout column class="pa-1">
            <v-form v-model="form.valid" ref="createJobVacancyForm">
              <div class="title mt-2 mb-3" :class="$store.state.style.text.color.formLabel">Create Job Vacancy</div>
              <v-card raised>
                <v-container fluid>
                  <v-text-field
                    label="Position title"
                    v-model="form.data.title"
                    :counter="150"
                    :rules="[(v) => v.length <= 150 || 'Position title must be 150 characters or less']"
                    :error-messages="form.errors.title"
                  ></v-text-field>
                  <v-layout row wrap class="ma-0">
                    <v-flex xs11 md4>
                      <v-dialog ref="closingDate" v-model="modals.closingDate.show" lazy full-width width="290px" :return-value.sync="form.data.closingDate">
                        <v-text-field
                          slot="activator"
                          label="Closing date"
                          v-model="form.data.closingDate"
                          prepend-icon="event"
                          :error-messages="form.errors.closingDate"
                          readonly
                        ></v-text-field>
                        <v-date-picker
                          color="primary lighten-1"
                          header-color="primary"
                          v-model="form.data.closingDate"
                        >
                          <v-spacer></v-spacer>
                          <v-btn flat small color="primary" @click="modals.closingDate.show = !modals.closingDate.show">Cancel</v-btn>
                          <v-btn flat small color="primary" @click="$refs.closingDate.save(form.data.closingDate)">OK</v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
                <div class="subheading mt-3 mb-2" :class="$store.state.style.text.color.formLabel">Content</div>
                <!-- <froala :tag="'textarea'" :config="form.editorConfig" v-model="form.data.content"></froala> -->
                <vue-editor id="vue2-editor" v-model="form.data.content"></vue-editor>
            </v-form>
          </v-layout>
          <!-- end form -->
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
  import { VueEditor } from 'vue2-editor'

  export default {
    props: {
      props: Object
    },
    components: {
      VueEditor
    },
    data () {
      return {
        form: {
          // editorConfig: {
          //   height: 650,
          //   theme: 'custom',
          //   requestHeaders: {
          //     'Authorization': 'Bearer ' + this.$auth.getToken()
          //   },
          //   imagePaste: false,
          //   videoUpload: false,
          //   // Image upload
          //   imageUploadURL: this.$store.state.api.baseUrl + '/admin/job-vacancy-image',
          //   imageUploadRemoteUrls: false,
          //   imageUploadParam: 'image',
          //   // Image manager
          //   imageManagerLoadURL: this.$store.state.api.baseUrl + '/admin/job-vacancy-images',
          //   // imageManagerLoadParams: {},
          //   imageManagerDeleteURL: this.$store.state.api.baseUrl + '/admin/job-vacancy-image',
          //   imageManagerDeleteMethod: 'DELETE',
          //   // File upload
          //   fileUploadURL: this.$store.state.api.baseUrl + '/admin/job-vacancy-file',
          //   fileUploadParams: Object
          // },
          valid: true,
          data: this.initFormData(),
          errors: []
        },
        modals: {
          closingDate: {
            show: false
          }
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
          }
        }
      }
    },
    methods: {
      initFormData () {
        return {
          title: '',
          closingDate: '',
          content: ''
        }
      },
      save () {
        this.axios.post('/admin/job-vacancy', this.form.data)
          .then(response => {
            // console.log(response.data)
            this.props.show = false
            this.$emit('jobVacancyCreated')
          })
          .catch(error => {
            console.log(error.response.data)
            this.form.errors = error.response.data.errors
          })
      }
    }
  }
</script>

<style scoped>
  html {
    overflow-y: hidden !important;
  }
</style>
