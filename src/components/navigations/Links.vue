<template>
  <v-layout column>
    <v-card flat class="transparent card--flex-toolbar">
      <v-toolbar card prominent>
        <v-toolbar-title class="title">Links</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn small color="primary" dark @click="modals.createLink.show = !modals.createLink.show">
          Create
        </v-btn>
      </v-toolbar>
      <v-progress-linear :indeterminate="true" height="2" class="ma-0" v-show="$store.state.progress"></v-progress-linear>
      <v-container fluid grid-list-lg>
        <v-data-iterator
          content-tag="v-layout"
          row
          wrap
          :items="links.items"
          :pagination.sync="links.pagination"
          hide-actions
        >
          <v-flex
            slot="item"
            slot-scope="props"
            xs12
            lg8 offset-lg2
          >
            <v-card class="px-2 mb-2">
              <v-layout row wrap>
                <v-flex xs4>
                  <v-card-media :src="props.item.thumb_image" height="150px" contain></v-card-media>
                </v-flex>
                <v-flex xs8>
                  <v-list dense>
                    <v-list-tile>
                      <v-list-tile-content>Title: {{ props.item.title }}</v-list-tile-content>
                      <!-- <v-list-tile-content class="text-xs-left">{{ props.item.title }}</v-list-tile-content> -->
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>URL: {{ props.item.url }}</v-list-tile-content>
                      <!-- <v-list-tile-content class="text-xs-left">{{ props.item.url }}</v-list-tile-content> -->
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>Hidden: {{ props.item.hidden ? 'Yes' : 'No' }}</v-list-tile-content>
                      <!-- <v-list-tile-content class="text-xs-left">{{ props.item.hidden ? 'Yes' : 'No' }}</v-list-tile-content> -->
                    </v-list-tile>
                  </v-list>
                  <div class="text-xs-right ma-2">
                      <v-tooltip bottom open-delay="700">
                        <span slot="activator" @click.stop="moveLink(props.item.id, 'up')">
                          <i :class="$store.state.style.text.color.default" class="fas fa-chevron-up pointer mx-2"></i>
                        </span>
                        <span>Move up</span>
                      </v-tooltip>
                      <v-tooltip bottom open-delay="700">
                        <span slot="activator" @click.stop="moveLink(props.item.id, 'down')">
                          <i :class="$store.state.style.text.color.default" class="fas fa-chevron-down pointer mx-2"></i>
                        </span>
                        <span>Move down</span>
                      </v-tooltip>
                      <v-tooltip bottom open-delay="700">
                        <span slot="activator" @click.stop="showEditLinkModal(props.item.id)">
                          <i :class="$store.state.style.text.color.default" class="fas fa-edit pointer mx-2"></i>
                        </span>
                        <span>Edit</span>
                      </v-tooltip>
                      <v-tooltip bottom open-delay="700">
                        <span slot="activator" @click.stop="showDeleteLinkModal(props.item)">
                          <i :class="$store.state.style.text.color.default" class="far fa-trash-alt pointer mx-2"></i>
                        </span>
                        <span>Delete</span>
                      </v-tooltip>
                  </div>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
      <!-- <v-data-table
        :headers="table.headers"
        :items="link.items"
        v-model="table.selected"
        :pagination.sync="table.pagination"
        :search="table.search"
        item-key="id"
        select-all="primary"
        hide-actions
        class="elevation-1"
        :loading="$store.state.progress"
      >        
        <template slot="items" slot-scope="props">
          <tr :class="props.item.hidden ? 'grey--text text--lighten-1' : ''">
            <td>
              <v-checkbox
                color="primary"
                hide-details
                v-model="props.selected"
              ></v-checkbox>
            </td>
            <td>
              <v-layout align-center class="pointer" @click="getPageNodes(props.item.id)">                
                {{ props.item.title }}
              </v-layout>
            </td>
            <td>{{ props.item.posted_at }}</td>
            <td>{{ props.item.updated_at }}</td>
            <td class="text-xs-right">
              <v-tooltip bottom open-delay="700">
                <span slot="activator" @click.stop="showEditModal(props.item.id)">
                  <i :class="$store.state.style.text.color.default" class="fas fa-pencil-alt pointer mr-1"></i>
                </span>
                <span>Edit</span>
              </v-tooltip>
              <v-tooltip bottom open-delay="700">
                <span slot="activator" @click.stop="showDeleteModal(props.item)">
                  <i :class="$store.state.style.text.color.default" class="far fa-trash-alt pointer mr-1"></i>
                </span>
                <span>Delete</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table> -->
    </v-card>

    <!-- modals -->
    <create-link
      :props.sync="modals.createLink"
      @linkCreated="getLinks"
    ></create-link>

    <edit-link
      :props.sync="modals.editLink"
      @linkEdited="getLinks"
    ></edit-link>

    <delete-link
      :props.sync="modals.deleteLink"
      @linkDeleted="getLinks"
    ></delete-link>

  </v-layout>
</template>

<script>
  import CreateLink from './modals/CreateLink'
  import EditLink from './modals/EditLink'
  import DeleteLink from './modals/DeleteLink'

  export default {
    components: {
      CreateLink,
      EditLink,
      DeleteLink
    },
    data () {
      return {
        links: {
          items: [],
          search: '',
          pagination: {
            sortBy: 'disposition',
            rowsPerPage: -1
          }
        },
        modals: {
          createLink: {
            show: false
          },
          editLink: {
            show: false,
            data: {}
          },
          deleteLink: {
            show: false,
            data: {}
          }
        }
      }
    },
    created () {
      this.getLinks()
    },
    methods: {
      getLinks () {
        this.$store.commit('SHOW_PROGRESS_BAR')
        this.axios.get('/admin/links')
          .then(response => {
            console.log(response.data)
            this.links.items = response.data
            this.$store.commit('HIDE_PROGRESS_BAR')
          })
          .catch(error => {
            this.$store.commit('HIDE_PROGRESS_BAR')
            console.log(error.response.data)
          })
      },
      showEditLinkModal (linkId) {
        this.axios.get('/admin/link/' + linkId)
          .then(response => {
            // console.log(response.data)
            this.modals.editLink.data = {
              id: response.data.id,
              title: response.data.title,
              url: response.data.url,
              thumbImage: response.data.thumb_image,
              hidden: response.data.hidden
            }
            this.modals.editLink.show = true
          })
          .catch(error => {
            console.log(error)
          })
      },
      showDeleteLinkModal (link) {
        this.modals.deleteLink.data = link
        this.modals.deleteLink.show = true
      },
      moveLink (linkId, dirtn) {
        this.axios.patch('/admin/link/' + linkId + '/' + dirtn)
          .then(response => {
            this.getLinks()
          })
          .catch(error => {
            console.log(error.response)
          })
      }
    }
  }
</script>

<style scope>
  .pointer {
    cursor: pointer;
  }
</style>