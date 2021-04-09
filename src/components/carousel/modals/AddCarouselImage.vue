<template>
  <v-dialog v-model="props.show" fullscreen transition="dialog-bottom-transition" :overlay="false">
    <v-card flat>
      <v-toolbar dark color="primary" flat>
        <v-btn flat icon @click.native="props.show = !props.show">
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-toolbar-title>Carousel</v-toolbar-title>
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
            <v-form v-model="form.valid" ref="addCarouselImageForm">
              <div class="title mt-2 mb-3" :class="$store.state.style.text.color.formLabel">Upload Image</div>
              <v-card raised>
                <v-container fluid>
                  <v-text-field
                    label="Title"
                    v-model="form.data.title"
                    :counter="150"
                    :rules="[(v) => v.length <= 150 || 'Title must be 150 characters or less']"
                    :error-messages="form.errors.title"
                  ></v-text-field>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <!-- <div class="subheading mb-2" :class="$store.state.style.text.color.formLabel"></div> -->
                      <v-card class="pa-2">
                        <v-layout align-center justify-center>
                          <v-btn
                            flat
                            @click="modals.carouselImage.show = !modals.carouselImage.show"
                            small 
                            color="primary"
                          >
                            Choose image
                          </v-btn>
                          <v-btn
                            v-if="form.data.src"
                            @click="form.data.src = ''"
                            small
                            class="grey--text text--darken-2"
                          >Remove</v-btn>
                        </v-layout>
                        <v-layout column align-center justify-center>
                          <img :src="form.data.src" class="carousel-image">
                        </v-layout>
                      </v-card>
                    </v-flex>
                  </v-layout>
                  <div v-if="form.errors.src" class="caption error--text">{{ form.errors.src[0] }}</div>
                  <v-layout align-center class="mt-4">
                    <v-checkbox v-model="form.data.link" hide-details color="primary" class="shrink mr-2"></v-checkbox>
                    <div class="subheading" :class="$store.state.style.text.color.formLabel">Link to content: {{ form.data.link ? 'Yes' : 'No' }}</div>
                  </v-layout>
                  <v-layout column>
                    <v-flex xs12 md4>
                      <v-select
                        :items="form.contentTypeItems"
                        v-model="form.data.contentType"
                        label="Content type"
                        bottom
                        :disabled="!form.data.link"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-select
                        dense
                        :items="form.contentItems"
                        v-model="form.data.content"
                        label="Select content"
                        item-text="title"
                        item-value="url"
                        hint="Select content type first"
                        persistent-hint
                        bottom
                        autocomplete
                        :disabled="!form.data.contentType"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                  <v-text-field
                    v-model="form.data.url"
                    :prefix="$store.getters.locationOrigin"
                    single-line
                    hint="Select content first"
                    persistent-hint
                    readonly
                    :error-messages="form.errors.url"
                  ></v-text-field>
                </v-container>
              </v-card>
            </v-form>
          </v-layout>
          <!-- end form -->
        </v-flex>
      </v-layout>
    </v-card>

    <!-- modals -->
    <carousel-image
      v-model="modals.carouselImage.show"
      @crop-success="carouselImageCropSuccess"
      :width="1153"
      :height="400"
      img-format="png"
      lang-type="en"
    ></carousel-image>

  </v-dialog>
</template>

<script>
  import 'babel-polyfill' // es6 shim
  import CarouselImage from 'vue-image-crop-upload'

  export default {
    components: {
      CarouselImage
    },
    props: {
      props: Object
    },
    data () {
      return {
        form: {
          contentTypeItems: [
            { value: 'page', text: 'Page' },
            { value: 'news', text: 'News' },
            { value: 'event', text: 'Event' },
            { value: 'announcement', text: 'Announcement' },
            { value: 'vacancy', text: 'Job vacancy' }
          ],
          contentItems: [],
          valid: true,
          data: this.initFormData(),
          errors: []
        },
        modals: {
          carouselImage: {
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
      'form.data.link': {
        handler (link) {
          if (!link) {
            this.form.data.contentType = ''
            this.form.data.content = ''
            this.form.data.url = ''
          }
        }
      },
      'form.data.contentType': {
        handler (contentType) {
          switch (contentType) {
            case 'page':
              this.getPageItems()
              break
            case 'news':
              this.getNewsItems()
              break
            case 'event':
              this.getEventItems()
              break
            default:
              this.form.contentItems = []
          }
        }
      },
      'form.data.content': {
        handler (content) {
          if (content) {
            this.form.data.url = content
          }
        }
      }
    },
    methods: {
      initFormData () {
        return {
          title: '',
          src: '',
          link: false,
          contentType: '',
          content: '',
          url: ''
        }
      },
      carouselImageCropSuccess (imgDataUrl, field) {
        this.form.data.src = imgDataUrl
      },
      getPageItems () {
        this.axios.get('/admin/pages')
          .then(response => {
            // console.log(response.data)
            this.form.contentItems = response.data
          })
          .catch(error => {
            console.log(error.response.data)
          })
      },
      getNewsItems () {
        this.axios.get('/admin/news-all')
          .then(response => {
            // console.log(response.data)
            this.form.contentItems = response.data
          })
          .catch(error => {
            console.log(error.response.data)
          })
      },
      getEventItems () {
        this.axios.get('/admin/events')
          .then(response => {
            // console.log(response.data)
            this.form.contentItems = response.data.map(obj => ({ title: obj.calendar_date + ' - ' + obj.title, url: obj.url }))
          })
          .catch(error => {
            console.log(error.response.data)
          })
      },
      save () {
        this.axios.post('/admin/carousel-image', this.form.data)
          .then(response => {
            // console.log(response.data)
            this.props.show = false
            this.$emit('carouselImageAdded')
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

  .carousel-image {
    max-width: 100% !important;
  }
</style>