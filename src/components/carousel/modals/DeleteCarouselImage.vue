<template>
  <v-dialog v-model="props.show" width="450px" persistent scrollable>
    <v-card class="card--flex-toolbar">
      <v-toolbar flat>
        <v-card-title class="grey lighten-4 title">
          Delete Carousel Image
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="props.show = !props.show">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text style="height: 130px;">
        <v-layout row wrap fill-height>
          <v-flex xs12 fill-height>
            <div class="ml-2">Select the checkbox below to confirm that you understand the impact of deleting this image:</div>
            <!-- form -->
            <form ref="confirmDelete">
              <v-layout align-center class="mt-2 ml-2">
                <v-checkbox
                  v-model="form.confirm"
                  color="primary"
                  hide-details 
                  class="shrink mr-2"
                ></v-checkbox>
                <span class="error--text">Delete this carousel item</span>
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
        <v-btn :color="form.confirm ? 'primary' : 'grey lighten-1'" flat @click.native="confirmDelete(props.data.id)" :disabled="!form.confirm">Delete</v-btn>
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
      'props.show': {
        handler (show) {
          if (!show) {
            this.form = this.initFormData()
            this.props.data = {}
          }
        }
      }
    },
    methods: {
      initFormData () {
        return {
          confirm: false
        }
      },
      confirmDelete (carouselImageId) {
        this.axios.delete('admin/carousel-image/' + carouselImageId)
          .then(response => {
            this.props.show = false
            this.$emit('carouselImageDeleted')
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
