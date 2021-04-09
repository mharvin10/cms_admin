<template>
  <v-dialog v-model="props.show" width="600px" persistent scrollable>
    <v-card class="card--flex-toolbar">
      <v-toolbar flat>
        <v-card-title class="grey lighten-4 title">
          Create page
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="props.show = !props.show">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text style="height: 540px;">
        <v-layout fill-height row wrap>
          <v-flex xs12 fill-height>
            <!-- form -->
            <v-form v-model="form.valid" ref="CreatePageForm">
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
              <div class="body-2 mt-3">Page options</div>
              <v-divider/>
              <v-layout v-show="props.data.children && props.data.children.length" align-center row wrap>
                <v-flex xs12 lg4>
                  <v-select
                    :items="locationOptions"
                    v-model="form.data.location"
                    label="Location option"
                    single-line
                    bottom
                    clearable
                  ></v-select>
                </v-flex>
                <v-flex xs12 lg8>
                  <v-select
                    :items="props.data.children"
                    item-value="id"
                    item-text="title"
                    v-model="form.data.sibling"
                    :error-messages="form.errors.sibling"
                    label="Select page"
                    single-line
                    bottom
                    :disabled="!form.data.location"
                  ></v-select>
                </v-flex>
              </v-layout>
              <v-layout align-center>
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
        <v-btn flat color="primary" @click="store(props.data.parent.id)" :disabled="!form.valid">Create</v-btn>
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
        locationOptions: [
          { value: 'before', text: 'Before' },
          { value: 'after', text: 'After' }
        ],
        form: {
          valid: true,
          data: this.initFormData(),
          errors: []
        }
      }
    },
    watch: {
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
          title: '',
          short_title: '',
          slug: '',
          redirect: false,
          redirect_url: '',
          location: '',
          sibling: '',
          hidden: false
        }
      },
      store (parentId) {
        this.axios.post('/admin/page/' + parentId, this.form.data)
          .then(response => {
            // console.log(response.data)
            this.props.show = false
            this.$emit('pageCreated')
          })
          .catch(error => {
            console.log(error.response.data)
            this.form.errors = error.response.data.errors
          })
      }
    }
  }
</script>