<template>
  <v-dialog v-model="props.show" fullscreen transition="dialog-bottom-transition" :overlay="false">
    <v-card flat>
      <v-toolbar dark color="primary" flat>
        <v-btn flat icon @click.native="props.show = !props.show">
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-toolbar-title>Announcements</v-toolbar-title>
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
            <v-form v-model="form.valid" ref="createAnnouncementForm">
              <div class="title mt-2 mb-3" :class="$store.state.style.text.color.formLabel">Create Announcement</div>
              <v-card raised>
                <v-container fluid>
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
        //   imageUploadURL: this.$store.state.api.baseUrl + '/admin/announcement-image',
        //   imageUploadRemoteUrls: false,
        //   imageUploadParam: 'image',
        //   // Image manager
        //   imageManagerLoadURL: this.$store.state.api.baseUrl + '/admin/announcement-images',
        //   // imageManagerLoadParams: {},
        //   imageManagerDeleteURL: this.$store.state.api.baseUrl + '/admin/announcement-image',
        //   imageManagerDeleteMethod: 'DELETE',
        //   // File upload
        //   fileUploadURL: this.$store.state.api.baseUrl + '/admin/announcement-file',
        //   fileUploadParams: Object
        // },
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
        }
      }
    }
  },
  methods: {
    initFormData () {
      return {
        title: '',
        content: ''
      }
    },
    save () {
      this.axios.post('/admin/announcement', this.form.data)
        .then(response => {
          // console.log(response.data)
          this.props.show = false
          this.$emit('announcementCreated')
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
