<template>
  <v-dialog v-model="props.show" fullscreen transition="dialog-bottom-transition" :overlay="false">
    <v-card flat>
      <v-toolbar dark color="primary" flat>
        <v-btn flat icon @click.native="props.show = !props.show">
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-toolbar-title>Calendar (Holidays & Events)</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat small @click="save">Save</v-btn>
        <v-btn icon @click.native="props.show = !props.show">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-layout row wrap py-3>
        <v-flex xs12 lg8 offset-lg2>
          <!-- form -->
          <v-layout column class="pa-1">
            <v-form v-model="form.valid" ref="createHolidayEventForm">
              <div class="title mt-2 mb-3" :class="$store.state.style.text.color.formLabel">Create Holiday/Event</div>
              <v-card raised>
                <v-container fluid>
                  <v-layout row wrap>
                    <v-flex xs11 md4>
                      <v-dialog
                        ref="calendarDate"
                        v-model="modals.calendarDate.show"
                        lazy
                        full-width
                        width="290px"
                        :return-value.sync="form.data.date"
                      >
                        <v-text-field
                          slot="activator"
                          label="Date"
                          v-model="form.data.date"
                          prepend-icon="event"
                          :error-messages="form.errors.date"
                          readonly
                        ></v-text-field>
                        <v-date-picker
                          color="primary lighten-1"
                          header-color="primary"
                          v-model="form.data.date"
                        >
                          <v-spacer></v-spacer>
                          <v-btn flat small color="primary" @click="modals.calendarDate.show = !modals.calendarDate.show">Cancel</v-btn>
                          <v-btn flat small color="primary" @click="$refs.calendarDate.save(form.data.date)">OK</v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs11 md3>
                      <v-select
                        :items="form.typeItems"
                        v-model="form.data.type"
                        label="Holiday/Event"
                        :error-messages="form.errors.type"
                        bottom
                      ></v-select>
                    </v-flex>
                    <v-flex xs11 md5>
                      <v-select
                        :items="form.holidayTypeItems"
                        v-model="form.data.holidayType"
                        label="Holiday type"
                        :error-messages="form.errors.type"
                        bottom
                        :disabled="!(form.data.type === 'holiday')"
                        class="ml-3"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                  <v-text-field
                    label="Title"
                    v-model="form.data.title"
                    :counter="150"
                    :rules="[(v) => v.length <= 150 || 'Title must be 150 characters or less']"
                    :error-messages="form.errors.title"
                  ></v-text-field>
                </v-container>
              </v-card>
              <div class="subheading mt-3 mb-2" :class="$store.state.style.text.color.formLabel">Content</div>
              <!-- <froala :tag="'textarea'" :config="form.editorConfig" v-model="form.data.details"></froala> -->
              <vue-editor id="vue2-editor" v-model="form.data.details"></vue-editor>
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
          //   height: 500,
          //   theme: 'custom',
          //   requestHeaders: {
          //     'Authorization': 'Bearer ' + this.$auth.getToken()
          //   },
          //   imagePaste: false,
          //   videoUpload: false,
          //   // Image upload
          //   imageUploadURL: this.$store.state.api.baseUrl + '/admin/calendar-image',
          //   imageUploadRemoteUrls: false,
          //   imageUploadParam: 'image',
          //   // Image manager
          //   imageManagerLoadURL: this.$store.state.api.baseUrl + '/admin/calendar-images',
          //   // imageManagerLoadParams: {},
          //   imageManagerDeleteURL: this.$store.state.api.baseUrl + '/admin/calendar-image',
          //   imageManagerDeleteMethod: 'DELETE',
          //   fileUpload: false
          // },
          typeItems: [
            { value: 'holiday', text: 'Holiday' },
            { value: 'event', text: 'Event' }
          ],
          holidayTypeItems: [
            'Regular Holiday', 'Special Non-working Day'
          ],
          valid: true,
          data: this.initFormData(),
          errors: []
        },
        modals: {
          calendarDate: {
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
      },
      'form.data.type': {
        handler (type) {
          if (type === 'event') {
            this.form.data.holidayType = ''
          }
        }
      }
    },
    methods: {
      initFormData () {
        return {
          date: '',
          title: '',
          type: '',
          holidayType: '',
          details: ''
        }
      },
      save () {
        this.axios.post('/admin/calendar-date', this.form.data)
          .then(response => {
            // console.log(response.data)
            this.props.show = false
            this.$emit('holidayEventCreated')
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
