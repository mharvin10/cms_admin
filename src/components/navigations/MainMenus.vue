<template>
  <v-layout column fill-height class="white">
    <v-card flat>
      <v-toolbar card flat extended>
        <v-toolbar-title class="title">Main menu</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="save">
          Save
          <v-icon right dark>save</v-icon>
        </v-btn>
      </v-toolbar>
      <v-progress-linear :indeterminate="true" height="2" class="ma-0" v-show="$store.state.progress"></v-progress-linear>
      <v-layout row pb-2>
        <v-flex xs12 lg8 offset-lg2>
          <v-card class="card--flex-toolbar pb-5">
            <v-form ref="mainMenu">
              <v-layout row wrap>
                <v-flex xs12 lg10 offset-lg1>
                  <v-container grid-list-lg>
                    <template v-for="item in mainMenus">
                      <v-layout align-center class="my-4">
                        <v-select
                          :items="pageNodeItems"
                          :label="'Menu ' + item.id"
                          v-model="item.page_node_id"
                          item-text="title"
                          item-value="id"
                          clearable
                          hide-details
                          single-line
                          dense
                        >
                          <template slot="selection" slot-scope="data">
                            <span class="grey--text text--darken-4">{{ data.item.short_title ? data.item.short_title.substr(0, 35) : data.item.title.substr(0, 35) }}</span>
                          </template>
                          <template slot="item" slot-scope="data">
                            <v-list-tile-content>
                              <v-list-tile-title>
                                {{ '&nbsp;'.repeat((data.item.depth - 1)*3) }} {{ data.item.title }}
                              </v-list-tile-title>
                            </v-list-tile-content>
                          </template>
                        </v-select>
                        <v-checkbox
                          v-model="item.hidden"
                          color="primary"
                          class="shrink ml-3"
                          hide-details
                          :disabled="!item.page_node_id"
                        ></v-checkbox>
                        <span :class="item.page_node_id ? $store.state.style.text.color.formLabel : $store.state.style.text.color.disabled" class="ml-1">Hide</span>
                      </v-layout>
                    </template>
                  </v-container>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
      </v-container>
    </v-card>

  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        mainMenus: [],
        pageNodeItems: []
      }
    },
    created () {
      this.getMainMenus()
      this.getPageNodeItems()
    },
    methods: {
      getMainMenus () {
        this.$store.commit('SHOW_PROGRESS_BAR')
        this.axios.get('/admin/main-menus')
          .then(response => {
            this.mainMenus = response.data
            this.$store.commit('HIDE_PROGRESS_BAR')
          })
          .catch(error => {
            this.$store.commit('HIDE_PROGRESS_BAR')
            console.log(error.response.data)
          })
      },
      getPageNodeItems () {
        // this.$store.commit('SHOW_PROGRESS_BAR')
        this.axios.get('/admin/page-nodes')
          .then(response => {
            this.pageNodeItems = response.data
            // this.$store.commit('HIDE_PROGRESS_BAR')
          })
          .catch(error => {
            // this.$store.commit('HIDE_PROGRESS_BAR')
            console.log(error.response)
          })
      },
      save () {
        this.axios.patch('/admin/main-menus', {
          mainMenus: this.mainMenus
        })
          .then(response => {
            this.getMainMenus()
          })
          .catch(error => {
            console.log(error.response.data)
          })
      }
    }
  }
</script>

<style scoped>
  .card--flex-toolbar {
    margin-top: -64px;
  }
</style>
