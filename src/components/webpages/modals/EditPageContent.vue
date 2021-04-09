<template>
  <v-dialog v-model="props.show" fullscreen transition="dialog-bottom-transition" :overlay="false">
    <v-card flat>
      <v-toolbar dark color="primary" flat extended>
        <v-btn flat icon @click.native="props.show = !props.show">
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-toolbar-title>Webpages</v-toolbar-title>
          <v-toolbar-title class="body-1">
            <i class="white--text fas fa-edit mr-1"></i>
            <span v-if="!form.isSaving">{{ props.data.title }}</span>
            <span v-else class="caption">saving...</span>
          </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat @click="update(props.data.id)">
          Update
          <v-icon right dark>save</v-icon>
        </v-btn>
        <v-btn icon @click.native="props.show = !props.show">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-layout row pb-2>
        <v-flex xs12 lg8 offset-lg2>
          <v-card class="card--flex-toolbar">
              <!-- form -->
              <!-- <v-form ref="editPageContentForm"> -->
                <!-- <froala :tag="'textarea'" :config="form.editorConfig" v-model="form.data.body"></froala> -->
                <vue-editor id="vue2-editor" v-model="form.data.body"></vue-editor>
              <!-- </v-form> -->
              <!-- end form -->
          </v-card>
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
          //   imageUploadURL: this.$store.state.api.baseUrl + '/admin/page-image',
          //   imageUploadRemoteUrls: false,
          //   imageUploadParam: 'image',
          //   imageUploadParams: Object,
          //   // Image manager
          //   imageManagerLoadURL: this.$store.state.api.baseUrl + '/admin/page-images',
          //   imageManagerLoadParams: Object,
          //   imageManagerDeleteURL: this.$store.state.api.baseUrl + '/admin/page-image',
          //   imageManagerDeleteMethod: 'DELETE',
          //   // File upload
          //   fileUploadURL: this.$store.state.api.baseUrl + '/admin/page-file',
          //   fileUploadParams: Object,
          //   // Auto-save
          //   saveURL: this.$store.state.api.baseUrl + '/admin/page-content',
          //   saveMethod: 'PATCH',
          //   saveParams: Object,
          //   saveInterval: 3500,
          //   events: {
          //     'froalaEditor.save.before': vm => {
          //       this.form.isSaving = true
          //     },
          //     'froalaEditor.save.after': vm => {
          //       this.form.isSaving = false
          //     }
          //   }
          // },
          isSaving: false,
          data: this.initFormData(),
          errors: []
        }
      }
    },
    watch: {
      'props.data': {
        handler (data) {
          // Object.assign(this.form.editorConfig.imageUploadParams, { pageId: data.id })
          // Object.assign(this.form.editorConfig.imageManagerLoadParams, { pageId: data.id })
          // Object.assign(this.form.editorConfig.fileUploadParams, { pageId: data.id })
          // Object.assign(this.form.editorConfig.saveParams, { pageId: data.id })
          this.form.data.body = data.body
        },
        deep: true
      },
      'form.data.redirect': {
        handler (redirect) {
          if (!redirect) {
            this.form.data.redirect_url = ''
          }
        }
      },
      'form.data.location': {
        handler (location) {
          if (!location) {
            this.form.data.sibling = ''
          }
        }
      },
      'props.show': {
        handler (show) {
          if (!show) {
            this.errors = []
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
          body: ''
        }
      },
      update (pageNodeId) {
        this.axios.patch('/admin/page-content', {
          pageId: pageNodeId,
          body: this.form.data.body
        })
          .then(response => {
            this.$emit('pageContentEdited')
          })
          .catch(error => {
            // console.log(error.response.data)
            this.errors = error.response.data.errors
          })
      }
    }
  }
</script>

<style scoped>
  html {
    overflow-y: hidden !important;
  }
  .card--flex-toolbar {
    margin-top: -64px;
  }
</style>
