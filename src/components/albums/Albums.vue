<template>
  <v-layout column>
    <v-card flat class="transparent card--flex-toolbar">
      <v-toolbar card prominent>
        <v-toolbar-title class="title">Albums</v-toolbar-title>
      </v-toolbar>
      <v-progress-linear :indeterminate="true" height="2" class="ma-0" v-show="$store.state.progress"></v-progress-linear>
      <v-container grid-list-xl>
        <v-layout row wrap>
          <v-flex xs12 sm6 md4 lg3 xl2>
            <v-card flat class="transparent">
              <v-divider class="my-1"/>
              <v-divider class="my-1"/>
              <v-divider class="my-1"/>
              <v-card tag="a" height="170" @click.native="modals.create.show = !modals.create.show">
                <v-container fill-height fluid>
                  <v-layout fill-height align-center>
                    <v-flex xs12 text-xs-center flexbox>
                      <v-icon x-large>add</v-icon>
                      <div>Add album</div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-card>
          </v-flex>
          <template v-for="item in albumItems">
            <v-flex xs12 sm6 md4 lg3 xl2>
              <v-card flat class="transparent" @contextmenu.prevent="showAlbumMenu($event, item)">
                <v-divider class="my-1"/>
                <v-divider class="my-1"/>
                <v-divider class="my-1"/>
                <template v-if="item.photo_count">
                  <v-card-media
                    :src="item.rand_photo"
                    height="170"
                    class="elevation-12"
                    @dblclick="showPhotos(item.id)"
                  >
                    <v-container fill-height class="ma-0 pa-0">
                      <v-layout row wrap fill-height>
                        <v-flex class="pa-0">
                          <div class="subheading white--text album-title px-3 py-2">{{ item.title }}</div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-media>
                </template>
                <template v-else>
                  <v-card tag="a" height="170" @click.native="showAddPhotosModal(item.id)">
                    <v-container fill-height fluid>
                      <v-layout fill-height align-center>
                        <v-flex xs12 text-xs-center flexbox>
                          <v-icon large>add_to_photos</v-icon>
                          <div>( empty )</div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </template>
                <!-- <v-card flat class="transparent text-xs-center"> -->

                  <!-- <v-layout column class="text-xs-left px-3 mt-2"> -->
                  <v-card-actions>
                    <i class="far fa-calendar-check mr-2" :class="$store.state.style.text.color.default"></i>{{ item.created_at }}
                    <v-spacer></v-spacer>
                    <v-tooltip top open-delay="700">
                      <v-btn v-if="item.photo_count" small icon slot="activator" @click.native="showAddPhotosModal(item.id)" class="ma-0">
                        <i class="far fa-plus-square" :class="$store.state.style.text.color.default"></i>
                      </v-btn>
                      <span>Add photos</span>
                    </v-tooltip>
                    <v-tooltip top open-delay="700">
                      <v-btn small icon slot="activator" @click.native="showEditModal(item.id)" class="ma-0">
                        <i class="far fa-edit" :class="$store.state.style.text.color.default"></i>
                      </v-btn>
                      <span>Edit album</span>
                    </v-tooltip>
                    <v-tooltip top open-delay="700">
                      <v-btn small icon slot="activator" @click.native="showDeleteModal(item)" class="ma-0">
                        <i class="far fa-trash-alt" :class="$store.state.style.text.color.default"></i>
                      </v-btn>
                      <span>Delete album</span>
                    </v-tooltip>
                    <v-btn v-if="item.hidden" small icon disabled class="ma-0">
                      <v-icon small color="grey darken-2">visibility_off</v-icon>
                    </v-btn>
                  </v-card-actions>
                  <div>{{ item.description }}</div>
                  <!-- </v-layout> -->
                <!-- </v-card> -->
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-container>
    </v-card>
    
    <!-- menus -->
    <v-menu
      offset-y
      v-model="menus.album.show"
      absolute
      :position-x="menus.album.x"
      :position-y="menus.album.y"
      @input="initMenus()"
    >
      <v-list dense>
        <v-list-tile :to="'/album/' + menus.album.item.id + '/photos'">
          <v-list-tile-title class="pl-4">Photos</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="showAddPhotosModal(menus.album.item.id)">
          <v-list-tile-title class="pl-4">Add photos</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="showEditModal(menus.album.item.id)">
          <v-list-tile-title class="pl-4">Edit album</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="showDeleteModal(menus.album.item)">
          <v-list-tile-title class="pl-4">Delete album</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <!-- modals -->
    <create-album
      :props.sync="modals.create"
      @albumCreated="getAlbums"
    ></create-album>

    <edit-album
      :props.sync="modals.edit"
      @albumEdited="getAlbums"
    ></edit-album>

    <delete-album
      :props.sync="modals.delete"
      @albumDeleted="getAlbums"
    ></delete-album>

    <add-album-photos
      :props.sync="modals.addPhotos"
      @photosAdded="getAlbums"
    ></add-album-photos>

  </v-layout>
</template>

<script>
  import CreateAlbum from './modals/CreateAlbum.vue'
  import EditAlbum from './modals/EditAlbum.vue'
  import DeleteAlbum from './modals/DeleteAlbum.vue'
  import AddAlbumPhotos from './modals/AddAlbumPhotos.vue'

  export default {
    components: {
      CreateAlbum,
      EditAlbum,
      DeleteAlbum,
      AddAlbumPhotos
    },
    data () {
      return {
        albumItems: [],
        menus: {
          album: Object
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
          },
          addPhotos: {
            show: false,
            albumId: ''
          }
        }
      }
    },
    created () {
      this.getAlbums()
      this.initMenus()
    },
    methods: {
      getAlbums () {
        this.$store.commit('SHOW_PROGRESS_BAR')
        this.axios.get('/admin/albums')
          .then(response => {
            // console.log(response.data)
            this.albumItems = response.data
            this.$store.commit('HIDE_PROGRESS_BAR')
          })
          .catch(error => {
            this.$store.commit('HIDE_PROGRESS_BAR')
            console.log(error.response)
          })
      },
      showPhotos (album) {
        this.$router.push({
          name: 'AlbumPhotos',
          params: { album }
        })
      },
      showEditModal (albumId) {
        this.axios.get('/admin/album/' + albumId)
          .then(response => {
            // console.log(response.data)
            this.modals.edit.data = response.data
            this.modals.edit.show = true
          })
          .catch(error => {
            console.log(error)
          })
      },
      showAddPhotosModal (albumId) {
        this.modals.addPhotos.albumId = albumId
        this.modals.addPhotos.show = true
      },
      showDeleteModal (album) {
        this.modals.delete.data = {
          id: album.id,
          title: album.title
        }
        this.modals.delete.show = true
      },
      showAlbumMenu (event, item) {
        this.menus.album.show = false
        this.menus.album.item = item
        this.menus.album.x = event.clientX
        this.menus.album.y = event.clientY
        this.$nextTick(() => {
          this.menus.album.show = true
        })
      },
      initMenus () {
        this.menus.album = {
          show: false,
          item: Object,
          x: 0,
          y: 0
        }
      }
    }
  }
</script>

<style>
  .album-title {
    background-color:rgba(48,48,48,0.3);
  }
</style>