<template>
  <v-dialog v-model="props.show" width="450px" persistent scrollable>
    <v-card class="card--flex-toolbar">
      <v-toolbar flat>
        <v-card-title class="grey lighten-4 title">
          Rename {{ props.data.isPage ? 'page' : 'section' }}
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
            <!-- form -->
            <v-form v-model="form.valid" ref="RenamePageNodeForm">
              <v-text-field
                label="Title"
                prepend-icon="title"
                v-model="form.data.title"
                :counter="150"
                :rules="[(v) => v.length <= 150 || 'Title must be 150 characters or less']"
                :error-messages="form.errors.title"
              ></v-text-field>
              <v-text-field
                prepend-icon="short_text"
                label="Short title (optional)"
                v-model="form.data.short_title"
                :counter="40"
                :rules="[(v) => v.length <= 40 || 'Short title must be 40 characters or less']"
                :error-messages="form.errors.description"
              ></v-text-field>
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
  </v-dialog>
</template>

<script>
  export default {
    props: {
      props: Object
    },
    data () {
      return {
        form: {
          valid: true,
          data: this.initFormData(),
          errors: []
        }
      }
    },
    watch: {
      'props.data': {
        handler (data) {
          this.form.data.title = data.title ? data.title : ''
          this.form.data.short_title = data.short_title ? data.short_title : ''
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
    methods: {
      initFormData () {
        return {
          title: '',
          short_title: ''
        }
      },
      update (pageNodeId) {
        this.axios.patch('/admin/page-node/' + pageNodeId + '/rename', this.form.data)
          .then(response => {
            // console.log(response.data)
            this.props.show = false
            this.$emit('pageNodeRenamed')
          })
          .catch(error => {
            console.log(error.response.data)
            this.form.errors = error.response.data.errors
          })
      }
    }
  }
</script>