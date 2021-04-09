<template>
  <v-layout column>
    <v-card flat class="card--flex-toolbar">
      <v-toolbar card prominent>
        <v-toolbar-title class="title mr-3">Announcements</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="table.search"
        ></v-text-field>
        <div class="caption mx-3">{{ countAnnouncements }} announcements</div>
        <v-btn small color="primary" dark @click="modals.create.show = !modals.create.show">
          New
        </v-btn>
      </v-toolbar>
      <v-data-table
        :headers="table.headers"
        :items="news.items"
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
                <!-- <i :class="(props.item.hidden ? $store.state.style.text.color.disabled : $store.state.style.text.color.default) + (props.item.isPage ? ' fa-file-alt mr-2' : ' fa-folder mr-1')" class="far fa-lg"></i> -->
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
      </v-data-table>
    </v-card>

    <!-- modals -->
    <create-announcement
      :props.sync="modals.create"
      @announcementCreated="getAnnouncements"
    ></create-announcement>

    <edit-announcement
      :props.sync="modals.edit"
      @announcementEdited="getAnnouncements"
    ></edit-announcement>

    <delete-announcement
      :props.sync="modals.delete"
      @announcementDeleted="getAnnouncements"
    ></delete-announcement>

  </v-layout>
</template>

<script>
  import CreateAnnouncement from './modals/CreateAnnouncement'
  import EditAnnouncement from './modals/EditAnnouncement'
  import DeleteAnnouncement from './modals/DeleteAnnouncement'

  export default {
    components: {
      CreateAnnouncement,
      EditAnnouncement,
      DeleteAnnouncement
    },
    data () {
      return {
        news: {
          items: []
        },
        table: {
          headers: [
            {
              text: 'Title',
              value: 'title',
              width: '45%'
            },
            {
              text: 'Date posted',
              value: 'posted_at',
              width: '20%'
            },
            {
              text: 'Date updated',
              value: 'updated_at',
              width: '20%'
            },
            {
              text: '',
              sortable: false,
              width: '15%'
            }
          ],
          selected: [],
          search: '',
          pagination: {
            sortBy: 'posted_at',
            descending: true,
            rowsPerPage: -1
          }
        },
        modals: {
          create: {
            show: false
          },
          edit: {
            show: false,
            data: {}
          },
          delete: {
            show: false,
            data: {}
          }
        }
      }
    },
    created () {
      this.getAnnouncements()
    },
    computed: {
      countAnnouncements () {
        return this.news.items ? this.news.items.length : 0
      }
    },
    methods: {
      getAnnouncements () {
        this.$store.commit('SHOW_PROGRESS_BAR')
        this.axios.get('/admin/announcements')
          .then(response => {
            // console.log(response.data)
            this.news.items = response.data
            this.$store.commit('HIDE_PROGRESS_BAR')
          })
          .catch(error => {
            this.$store.commit('HIDE_PROGRESS_BAR')
            console.log(error.response)
          })
      },
      getAnnouncement (announcementId) {
        return this.axios.get('/admin/announcement/' + announcementId)
      },
      showEditModal (announcementId) {
        this.getAnnouncement(announcementId)
          .then(response => {
            // console.log(response.data)
            this.modals.edit.data = {
              id: response.data.id,
              title: response.data.title,
              content: response.data.content,
              hidden: response.data.hidden
            }
            this.modals.edit.show = true
          })
          .catch(error => {
            console.log(error)
          })
      },
      showDeleteModal (announcement) {
        this.modals.delete.data = announcement
        this.modals.delete.show = true
      }
    }
  }
</script>

<style>
  .pointer {
    cursor: pointer;
  }
</style>