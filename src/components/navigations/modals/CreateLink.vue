<template>
  <v-dialog v-model="props.show" width="550px" persistent scrollable>
    <v-card class="card--flex-toolbar">
      <v-toolbar flat>
        <v-card-title class="grey lighten-4 title">
        Create link
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="props.show = !props.show">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text style="height: 380px;">
        <v-layout row wrap fill-height>
          <v-flex xs12 fill-height>
            <!-- form -->
            <v-form v-model="form.valid" ref="createLinkForm">
              <v-text-field
                label="Title"
                prepend-icon="title"
                v-model="form.data.title"
                :counter="100"
                :rules="[(v) => v.length <= 100 || 'Title must be 100 characters or less']"
                :error-messages="form.errors.title"
              ></v-text-field>
              <v-text-field
                label="URL"
                :hint="'Example: ' + $store.getters.locationOrigin + '/some-page or www.beautifulpage.com'"
                persistent-hint
                v-model="form.data.url"
                :error-messages="form.errors.url"
              ></v-text-field>
              <div class="body-2 mt-4">Thumbnail</div>
              <v-divider/>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-card class="mt-2 pa-2">
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
                      <img :src="form.data.thumbImage" class="header-image">
                    </v-layout>
                  </v-card>
                </v-flex>
              </v-layout>
              <div v-if="form.errors.thumbImage" class="caption error--text">{{ form.errors.thumbImage[0] }}</div>
              <div class="body-2 mt-4">Page options</div>
              <v-divider/>
              <v-layout align-center class="mt-2">
                <v-checkbox
                  v-model="form.data.hidden"
                  color="primary"
                  hide-details 
                  class="shrink mr-2"
                ></v-checkbox>
                <span class="body-1">Hide: {{ form.data.hidden ? 'Yes' : 'No' }}</span>
              </v-layout>
            </v-form>
            <!-- end form -->
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="props.show = !props.show">Cancel</v-btn>
        <v-btn flat color="primary" @click="store" :disabled="!form.valid">Create</v-btn>
      </v-card-actions>
    </v-card>

    <!-- modals -->
    <thumb-image
      v-model="modals.thumbImage.show"
      @crop-success="thumbImageCropSuccess"
      :width="150"
      :height="150"
      img-format="png"
      lang-type="en"
    ></thumb-image>

  </v-dialog>
</template>

<script>
  import 'babel-polyfill' // es6 shim
  import ThumbImage from 'vue-image-crop-upload'

  export default {
    components: {
      ThumbImage
    },
    props: {
      props: Object
    },
    data () {
      return {
        form: {
          valid: true,
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
          title: '',
          url: '',
          thumbImage: '',
          hidden: false
        }
      },
      thumbImageCropSuccess (imgDataUrl, field) {
        this.form.data.thumbImage = imgDataUrl
      },
      store () {
        this.axios.post('/admin/link', this.form.data)
          .then(response => {
            // console.log(response.data)
            this.props.show = false
            this.$emit('linkCreated')
          })
          .catch(error => {
            console.log(error.response.data)
            this.form.errors = error.response.data.errors
          })
      }
    }
  }
</script>