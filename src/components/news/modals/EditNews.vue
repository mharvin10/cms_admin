<template>
  <v-dialog v-model="props.show" fullscreen transition="dialog-bottom-transition" :overlay="false">
    <v-card flat>
      <v-toolbar dark color="primary" flat>
        <v-btn flat icon @click.native="props.show = !props.show">
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-toolbar-title>News</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat @click="update(props.data.id)">
          Update
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
            <v-form v-model="form.valid" ref="editNewsForm">
              <div class="title mt-2 mb-3" :class="$store.state.style.text.color.formLabel">Edit News</div>
              <v-card raised>
                <v-container fluid>
                  <v-text-field
                    label="News title"
                    v-model="form.data.title"
                    :counter="150"
                    :rules="[(v) => v.length <= 150 || 'Title must be 150 characters or less']"
                    :error-messages="form.errors.title"
                  ></v-text-field>
                  <v-layout row wrap>
                    <v-flex xs12 lg6>
                      <v-text-field
                        label="Author"
                        v-model="form.data.author"
                        :error-messages="form.errors.author"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout align-center class="mt-2 mb-4">
                    <v-checkbox
                      v-model="form.data.featured"
                      hide-details
                      color="primary"
                      class="shrink mr-2"
                    ></v-checkbox>
                    <span class="subheading" :class="$store.state.style.text.color.formLabel">Featured: {{ form.data.featured ? 'Yes' : 'No' }}</span>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <div class="subheading mb-2" :class="$store.state.style.text.color.formLabel">Thumbnail</div>
                      <v-card class="pa-2">
                        <v-layout align-center justify-center>
                          <v-btn
                            flat
                            @click="modals.thumbImage.show = !modals.thumbImage.show"
                            small
                            color="primary"
                          >
                            Choose image
                          </v-btn>
                          <v-btn
                            v-if="form.data.thumbImage"
                            @click="form.data.thumbImage = ''"
                            small
                            class="grey--text text--darken-2"
                          >Remove</v-btn>
                        </v-layout>
                        <v-layout column align-center justify-center>
                          <img :src="form.data.thumbImage">
                        </v-layout>
                      </v-card>
                    </v-flex>
                  </v-layout>
                  <div v-if="form.errors.thumbImage" class="caption error--text">{{ form.errors.thumbImage[0] }}</div>
                  <v-layout row wrap class="mt-4 mb-3">
                    <v-flex xs12 md6>
                      <v-select
                        prepend-icon="photo_library"
                        dense
                        :items="form.albumItems"
                        v-model="form.data.photoAlbum"
                        label="News photos"
                        item-text="title"
                        item-value="id"
                        hint="Select album here"
                        persistent-hint
                        bottom
                        autocomplete
                      ></v-select>
                    </v-flex>
                  </v-layout>
                  <v-layout align-center class="subheading mt-4 mb-2" :class="$store.state.style.text.color.formLabel">
                    <span>Don't show this news?</span>
                    <v-checkbox
                      v-model="form.data.hidden"
                      hide-details
                      color="primary"
                      class="shrink mx-2"
                    ></v-checkbox>
                    <span>{{ form.data.hidden ? 'Yes' : 'No' }}</span>
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

    <!-- modals -->
    <thumb-image
      v-model="modals.thumbImage.show"
      @crop-success="thumbImageCropSuccess"
      :width="300"
      :height="180"
      img-format="png"
      lang-type="en"
    ></thumb-image>

  </v-dialog>
</template>

<script>
  import 'babel-polyfill' // es6 shim
  import ThumbImage from 'vue-image-crop-upload'
  import { VueEditor } from 'vue2-editor'

  export default {
    components: {
      ThumbImage,
      VueEditor
    },
    props: {
      props: Object
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
          //   imageUploadURL: this.$store.state.api.baseUrl + '/admin/news-image',
          //   imageUploadRemoteUrls: false,
          //   imageUploadParam: 'image',
          //   // Image manager
          //   imageManagerLoadURL: this.$store.state.api.baseUrl + '/admin/news-images',
          //   imageManagerDeleteURL: this.$store.state.api.baseUrl + '/admin/news-image',
          //   imageManagerDeleteMethod: 'DELETE',
          //   fileUpload: false
          // },
          valid: true,
          albumItems: [],
          data: this.initFormData(),
          errors: []
        },
        modals: {
          thumbImage: {
            show: false
          }
        }
      }
    },
    watch: {
      'props.data': {
        handler (data) {
          this.form.data = {
            title: data.title ? data.title : '',
            author: data.author,
            featured: data.featured,
            thumbImage: data.thumb_image,
            photoAlbum: data.photo_album,
            content: data.content,
            hidden: data.hidden
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
    created () {
      this.getAlbumItems()
    },
    methods: {
      initFormData () {
        return {
          title: '',
          author: '',
          featured: false,
          thumbImage: '',
          photoAlbum: '',
          content: '',
          hidden: false
        }
      },
      thumbImageCropSuccess (imgDataUrl, field) {
        this.form.data.thumbImage = imgDataUrl
      },
      getAlbumItems () {
        this.axios.get('/admin/albums')
          .then(response => {
            // console.log(response.data)
            this.form.albumItems = response.data
          })
          .catch(error => {
            console.log(error.response.data)
          })
      },
      update (newsId) {
        this.axios.patch('/admin/news/' + newsId, this.form.data)
          .then(response => {
            // console.log(response.data)
            this.props.show = false
            this.$emit('newsEdited')
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
