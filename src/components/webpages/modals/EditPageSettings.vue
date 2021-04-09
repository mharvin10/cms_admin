<template>
  <v-dialog v-model="props.show" width="600px" persistent scrollable>
    <v-card class="card--flex-toolbar">
      <v-toolbar flat>
        <v-card-title class="grey lighten-4 title">
          Advanced settings
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="props.show = !props.show">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text style="height: 440px;">
        <v-layout row wrap fill-height>
          <v-flex xs12 fill-height>
            <!-- form -->
            <v-form v-model="form.valid" ref="editPageSettingsForm">
              <div class="body-2 mt-2">Custom URL name <span class="caption">(If blank, the system will generate the url for this page)</span></div>
              <v-divider/>
              <v-text-field
                :hint="'Example: ' + $store.getters.locationOrigin + '/some-page'"
                persistent-hint
                v-model="form.data.slug"
                :prefix="$store.getters.locationOrigin + '/'"
                :error-messages="form.errors.slug"
              ></v-text-field>
              <div class="body-2 mt-3">Redirection <span class="caption">(Redirect to other page or external link)</span></div>
              <v-divider/>
              <v-layout align-center>
                <v-checkbox v-model="form.data.redirect" hide-details color="primary" class="shrink mr-2"></v-checkbox>
                <v-text-field
                  label="Redirect to"
                  :hint="'Example: ' + $store.getters.locationOrigin + '/some-page or www.domain.com'"
                  persistent-hint
                  v-model="form.data.redirect_url"
                  :error-messages="form.errors.redirect_url"
                  :disabled="!form.data.redirect"
                ></v-text-field>
              </v-layout>
              <div class="body-2 mt-3">Header image</div>
              <v-divider/>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-card class="mt-2 pa-2">
                    <v-layout align-center justify-center>
                      <v-btn
                        flat
                        @click="modals.headerImage.show = !modals.headerImage.show"
                        small 
                        color="primary"
                      >
                        Choose image
                      </v-btn>
                      <v-btn
                        v-if="form.data.headerImage"
                        @click="form.data.headerImage = ''"
                        small
                        class="grey--text text--darken-2"
                      >Remove</v-btn>
                    </v-layout>
                    <v-layout column align-center justify-center>
                      <img :src="form.data.headerImage" class="header-image">
                    </v-layout>
                  </v-card>
                </v-flex>
              </v-layout>
              <div v-if="form.errors.headerImage" class="caption error--text">{{ form.errors.headerImage[0] }}</div>
              <div class="body-2 mt-3">Page option</div>
              <v-divider></v-divider>
              <v-layout align-center class="mt-3">
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
        <v-btn flat color="primary" @click="update(props.data.id)" :disabled="!form.valid">Save</v-btn>
      </v-card-actions>
    </v-card>

    <!-- modals -->
    <header-image
      v-model="modals.headerImage.show"
      @crop-success="headerImageCropSuccess"
      :width="600"
      :height="200"
      img-format="png"
      lang-type="en"
    ></header-image>

  </v-dialog>
</template>

<script>
  import 'babel-polyfill' // es6 shim
  import HeaderImage from 'vue-image-crop-upload'

  export default {
    components: {
      HeaderImage
    },
    props: {
      props: Object
    },
    data () {
      return {
        locationOptions: [
          { value: 'before', text: 'Before' },
          { value: 'after', text: 'After' }
        ],
        form: {
          valid: true,
          data: this.initFormData(),
          errors: []
        },
        modals: {
          headerImage: {
            show: false
          }
        }
      }
    },
    watch: {
      'props.data': {
        handler (data) {
          this.form.data = {
            slug: data.slug,
            redirect: data.redirect_url ? 1 : 0,
            redirect_url: data.redirect_url,
            headerImage: data.header_image,
            hidden: data.hidden
          }
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
          slug: '',
          redirect: false,
          redirect_url: '',
          header_image: '',
          hidden: false
        }
      },
      headerImageCropSuccess (imgDataUrl, field) {
        this.form.data.headerImage = imgDataUrl
      },
      update (parentId) {
        this.axios.patch('/admin/page-settings/' + parentId, this.form.data)
          .then(response => {
            // console.log(response.data)
            this.props.show = false
            this.$emit('pageSettingsEdited')
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
  .header-image {
    max-width: 100% !important;
  }
</style>