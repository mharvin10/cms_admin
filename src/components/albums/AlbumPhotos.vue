<template>
  <v-layout column>
    <v-card flat class="transparent card--flex-toolbar">
      <v-toolbar card prominent>
        <v-btn flat small icon to="/albums">
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
        <v-toolbar-title class="title">Albums</v-toolbar-title>
        <v-toolbar-title slot="extension" class="body-2">{{ album.title }}</v-toolbar-title>
        <v-spacer slot="extension"></v-spacer>
        <div slot="extension" class="caption">{{ album.photo_count }} photos</div>
        <v-btn slot="extension" small flat color="primary" @click="showAddPhotosModal(album.id)">
          <v-icon class="mr-1">add_to_photos</v-icon> Photos
        </v-btn>
      </v-toolbar>
      <v-progress-linear :indeterminate="true" height="2" class="ma-0" v-show="$store.state.progress"></v-progress-linear>
      <v-container grid-list-xl>
        <v-layout row wrap>
          <template v-for="item in album.photos">
            <v-flex xs12 sm6 md4 lg3 xl2>
              <v-card>
                <v-card-media :src="item.url" height="180">
                  <v-container fill-height class="pa-0">
                    <v-layout fill-height align-end>
                      <v-flex class="pa-2 text-xs-center photo-actions">
                        <v-tooltip top open-delay="700">
                          <v-btn small fab dark flat slot="activator" @click.native="showPhotoModal(item.url)" class="my-0 mx-1">
                            <!-- <v-icon>zoom_in</v-icon> -->
                            <i class="fas fa-search-plus"></i>
                          </v-btn>
                          <span>View photo</span>
                        </v-tooltip>
                        <v-tooltip top open-delay="700">
                          <v-btn small fab dark flat slot="activator" @click.native="showEditPhotoModal(item.id)" class="my-0 mx-1">
                            <i class="fas fa-edit"></i>
                          </v-btn>
                            <span>Edit caption</span>
                        </v-tooltip>
                        <v-tooltip top open-delay="700">
                          <v-btn small fab dark flat slot="activator" @click.native="showDeleteAlbumPhotoModal(item.id)" class="my-0 mx-1">
                            <i class="far fa-trash-alt"></i>
                          </v-btn>
                          <span>Delete photo</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-media>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-container>
    </v-card>

    <show-photo
      :props.sync="modals.showPhoto"
    ></show-photo>

    <add-album-photos
      :props.sync="modals.addPhotos"
      @photosAdded="getAlbumPhotos"
    ></add-album-photos>

    <edit-photo
      :props.sync="modals.editPhoto"
      @photoEdited="getAlbumPhotos"
    ></edit-photo>

    <delete-album-photo
      :props.sync="modals.deleteAlbumPhoto"
      @albumPhotoDeleted="getAlbumPhotos"
    ></delete-album-photo>

  </v-layout>
</template>

<script>
  import ShowPhoto from '@/components/photos/modals/ShowPhoto.vue'
  import AddAlbumPhotos from './modals/AddAlbumPhotos.vue'
  import EditPhoto from '@/components/photos/modals/EditPhoto.vue'
  import DeleteAlbumPhoto from './modals/DeleteAlbumPhoto.vue'

  export default {
    components: {
      ShowPhoto,
      AddAlbumPhotos,
      EditPhoto,
      DeleteAlbumPhoto
    },
    data () {
      return {
        album: {},
        modals: {
          showPhoto: {
            show: false,
            photoSrc: ''
          },
          addPhotos: {
            show: false,
            albumId: ''
          },
          editPhoto: {
            show: false,
            data: {}
          },
          deleteAlbumPhoto: {
            show: false,
            data: {}
          }
        }
      }
    },
    created () {
      this.getAlbumPhotos()
    },
    methods: {
      getAlbumPhotos () {
        this.axios.get('/admin/album/' + this.$route.params.album + '/photos')
          .then(response => {
            // console.log(response.data)
            this.album = response.data
          })
      },
      showPhotoModal (photoSrc) {
        this.modals.showPhoto.show = true
        this.modals.showPhoto.photoSrc = photoSrc
      },
      showAddPhotosModal (albumId) {
        this.modals.addPhotos.albumId = albumId
        this.modals.addPhotos.show = true
      },
      showEditPhotoModal (photoId) {
        this.axios.get('/admin/photo/' + photoId)
          .then(response => {
            // console.log(response.data)
            this.modals.editPhoto.data = response.data
            this.modals.editPhoto.show = true
          })
          .catch(error => {
            console.log(error.response)
          })
      },
      showDeleteAlbumPhotoModal (photoId) {
        this.modals.deleteAlbumPhoto.show = true
        this.modals.deleteAlbumPhoto.data = {
          albumId: this.album.id,
          photoId: photoId
        }
      }
    }
  }
</script>

<style scope>
  .photo-actions {
    background-color:rgba(48,48,48,0.3);
  }
</style>
