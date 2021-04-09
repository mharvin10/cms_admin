<template>
  <v-dialog v-model="props.show" width="600px" persistent scrollable>
    <v-card class="card--flex-toolbar">
      <v-toolbar flat>
        <v-card-title class="grey lighten-4 title">
          Add Photos
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="props.show = !props.show">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text style="height: 200px;">
        <v-layout row wrap fill-height>
          <v-flex xs12 fill-height>

            <vue-dropzone
              ref="myVueDropzone"
              id="dropzone"
              :options="dropzoneOptions"
              @vdropzone-sending="sendingEvent"
            ></vue-dropzone>

          </v-flex>
        </v-layout>
      </v-card-text>
      <!-- <v-divider></v-divider> -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="props.show = !props.show">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import vue2Dropzone from 'vue2-dropzone'
  import 'vue2-dropzone/dist/vue2Dropzone.css'

  export default {
    components: {
      vueDropzone: vue2Dropzone
    },
    props: {
      props: Object
    },
    data () {
      return {
        dropzoneOptions: {
          method: 'POST',
          url: this.$store.state.api.baseUrl + '/admin/album/photos',
          headers: {
            'Authorization': 'Bearer ' + this.$auth.getToken()
          },
          maxFilesize: 0.5,
          // addRemoveLinks: true,
          // dictRemoveFile: 'Remove',
          dictDefaultMessage: "<i class='fas fa-cloud-upload-alt fa-3x'></i><br>Drop image here to upload"
        }
      }
    },
    watch: {
      'props.show': {
        handler (show) {
          if (!show) {
            this.props.albumId = ''
            this.$emit('photosAdded')
            this.$refs.myVueDropzone.removeAllFiles()
          }
        }
      }
    },
    methods: {
      sendingEvent (file, xhr, formData) {
        formData.append('albumId', this.props.albumId)
      }
    }
  }
</script>
