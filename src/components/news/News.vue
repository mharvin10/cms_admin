<template>
  <v-layout column>
    <v-card flat class="card--flex-toolbar">
      <v-toolbar card prominent>
        <v-toolbar-title class="title mr-3">News</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="table.search"
        ></v-text-field>
        <div class="caption mx-3">{{ countAllNews }} news</div>
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
        <!-- <v-progress-linear slot="progress" color="secondary" height="3" indeterminate v-show="$store.state.progress"></v-progress-linear> -->
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
    <create-news
      :props.sync="modals.create"
      @newsCreated="getAllNews"
    ></create-news>

    <edit-news
      :props.sync="modals.edit"
      @newsEdited="getAllNews"
    ></edit-news>

    <delete-news
      :props.sync="modals.delete"
      @newsDeleted="getAllNews"
    ></delete-news>

  </v-layout>
</template>

<script>
  import CreateNews from './modals/CreateNews.vue'
  import EditNews from './modals/EditNews.vue'
  import DeleteNews from './modals/DeleteNews.vue'

  export default {
    components: {
      CreateNews,
      EditNews,
      DeleteNews
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
      this.getAllNews()
    },
    computed: {
      countAllNews () {
        return this.news.items ? this.news.items.length : 0
      }
    },
    methods: {
      getAllNews () {
        this.$store.commit('SHOW_PROGRESS_BAR')
        this.axios.get('/admin/news-all')
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
      getNews (newsId) {
        return this.axios.get('/admin/news/' + newsId)
      },
      showEditModal (newsId) {
        this.getNews(newsId)
          .then(response => {
            // console.log(response.data)
            this.modals.edit.data = {
              id: response.data.id,
              title: response.data.title,
              author: response.data.author,
              featured: response.data.featured,
              thumb_image: response.data.thumb_image,
              photo_album: response.data.photo_album,
              content: response.data.content,
              hidden: response.data.hidden
            }
            this.modals.edit.show = true
          })
          .catch(error => {
            console.log(error)
          })
      },
      showDeleteModal (news) {
        this.modals.delete.data = news
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
