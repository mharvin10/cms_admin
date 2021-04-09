<template>
  <v-dialog v-model="props.show" width="450px" persistent scrollable>
    <v-card class="card--flex-toolbar">
      <v-toolbar flat>
        <v-card-title class="grey lighten-4 title">
          Delete Photo
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="props.show = !props.show">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text style="height: 150px;">
        <v-layout row wrap fill-height>
          <v-flex xs12 fill-height>
            <div class="ml-2">Select the checkbox below to confirm that you understand the impact of deleting this photo:</div>
            <!-- form -->
            <form ref="confirmDelete">
              <v-layout align-center class="mt-2 ml-2">
                <v-checkbox
                  v-model="form.confirm"
                  color="primary"
                  hide-details 
                  class="shrink mr-2"
                ></v-checkbox>
                <span class="error--text">Remove this photo from album</span>
              </v-layout>
              <v-layout align-center class="ml-2">
                <v-checkbox
                  v-model="form.deletePhoto"
                  color="primary"
                  hide-details 
                  class="shrink mr-2"
                  :disabled="!form.confirm"
                ></v-checkbox>
                <span :class="!form.confirm ? 'grey--text text--lighten-1' : 'error--text'">Delete this photo in the storage</span>
              </v-layout>
            </form>
            <!-- end form -->
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="props.show = !props.show">Cancel</v-btn>
        <v-btn :color="form.confirm ? 'primary' : 'grey lighten-1'" flat @click.native="confirmDelete()" :disabled="!form.confirm">Delete</v-btn>
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
        form: this.initFormData()
      }
    },
    watch: {
      'props.data': {
        handler (data) {
          this.form.photoId = this.props.data.photoId
        },
        deep: true
      },
      'form.confirm': {
        handler (confirm) {
          if (!confirm) {
            this.form.deletePhoto = false
          }
        }
      },
      'props.show': {
        handler (show) {
          if (!show) {
            this.props.show = false
            this.form = this.initFormData()
            this.props.data = {}
          }
        }
      }
    },
    methods: {
      initFormData () {
        return {
          photoId: '',
          confirm: false,
          deletePhoto: false
        }
      },
      confirmDelete () {
        this.axios.post('admin/album/' + this.props.data.albumId + '/photo/delete', this.form)
          .then(response => {
            this.props.show = false
            this.$emit('albumPhotoDeleted')
          })
          .catch(error => {
            console.log(error.response)
          })
      }
    }
  }
</script>

<style>
  .checkbox label {
    margin-top: 4px !important;
  }
</style>
