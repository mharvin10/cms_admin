<template>
  <v-layout column>
    <v-card flat class="card--flex-toolbar">
      <v-toolbar card prominent>
        <v-toolbar-title class="title mr-3">Carousel</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="table.search"
        ></v-text-field>
        <div class="caption mx-3">{{ countCarouselImages }} items</div>
        <v-btn small color="primary" dark @click="modals.addCarouselImage.show = !modals.addCarouselImage.show">
          New
        </v-btn>
      </v-toolbar>
      <v-data-table
        :headers="table.headers"
        :items="carousel.items"
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
            <td>{{ props.item.created_at }}</td>
            <td>{{ props.item.updated_at }}</td>
            <td class="text-xs-right">
              <v-tooltip bottom open-delay="700">
                <span slot="activator" @click.stop="moveCarouselImage(props.item.id, 'up')">
                  <i :class="$store.state.style.text.color.default" class="fas fa-chevron-up pointer mr-1"></i>
                </span>
                <span>Move up</span>
              </v-tooltip>
              <v-tooltip bottom open-delay="700">
                <span slot="activator" @click.stop="moveCarouselImage(props.item.id, 'down')">
                  <i :class="$store.state.style.text.color.default" class="fas fa-chevron-down pointer mr-1"></i>
                </span>
                <span>Move down</span>
              </v-tooltip>
              <v-tooltip bottom open-delay="700">
                <span slot="activator" @click.stop="showOrHideCarouselImage(props.item.id)">
                  <i :class="$store.state.style.text.color.default + (props.item.hidden ? ' fa-eye' : ' fa-eye-slash')" class="fas pointer mr-1"></i>
                </span>
                <span>{{ props.item.hidden ? 'Show' : 'Hide' }}</span>
              </v-tooltip>
              <v-tooltip bottom open-delay="700">
                <span slot="activator" @click.stop="showEditCarouselImageModal(props.item.id)">
                  <i :class="$store.state.style.text.color.default" class="fas fa-pencil-alt pointer mr-1"></i>
                </span>
                <span>Edit</span>
              </v-tooltip>
              <v-tooltip bottom open-delay="700">
                <span slot="activator" @click.stop="showDeleteCarouselImageModal(props.item)">
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
    <add-carousel-image
      :props.sync="modals.addCarouselImage"
      @carouselImageAdded="getCarouselImages"
    ></add-carousel-image>

    <edit-carousel-image
      :props.sync="modals.editCarouselImage"
      @carouselImageEdited="getCarouselImages"
    ></edit-carousel-image>

    <delete-carousel-image
      :props.sync="modals.deleteCarouselImage"
      @carouselImageDeleted="getCarouselImages"
    ></delete-carousel-image>

  </v-layout>
</template>

<script>
  import AddCarouselImage from './modals/AddCarouselImage.vue'
  import EditCarouselImage from './modals/EditCarouselImage.vue'
  import DeleteCarouselImage from './modals/DeleteCarouselImage.vue'

  export default {
    components: {
      AddCarouselImage,
      EditCarouselImage,
      DeleteCarouselImage
    },
    props: {
      props: Object
    },
    data () {
      return {
        carousel: {
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
              value: 'created_at',
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
            sortBy: 'disposition',
            rowsPerPage: -1
          }
        },
        modals: {
          addCarouselImage: {
            show: false
          },
          editCarouselImage: {
            show: false,
            data: {}
          },
          deleteCarouselImage: {
            show: false,
            data: {}
          }
        }
      }
    },
    created () {
      this.getCarouselImages()
    },
    computed: {
      countCarouselImages () {
        return this.carousel.items ? this.carousel.items.length : 0
      }
    },
    methods: {
      getCarouselImages () {
        this.$store.commit('SHOW_PROGRESS_BAR')
        this.axios.get('/admin/carousel-images')
          .then(response => {
            console.log(response.data)
            this.carousel.items = response.data
            this.$store.commit('HIDE_PROGRESS_BAR')
          })
          .catch(error => {
            this.$store.commit('HIDE_PROGRESS_BAR')
            console.log(error.response)
          })
      },
      getCarouselImage (carouselImageId) {
        return this.axios.get('/admin/carousel-image/' + carouselImageId)
      },
      showEditCarouselImageModal (carouselImageId) {
        this.getCarouselImage(carouselImageId)
          .then(response => {
            // console.log(response.data)
            this.modals.editCarouselImage.data = {
              id: response.data.id,
              title: response.data.title,
              src: response.data.src,
              url: response.data.url,
              hidden: response.data.hidden
            }
            this.modals.editCarouselImage.show = true
          })
          .catch(error => {
            console.log(error)
          })
      },
      moveCarouselImage (carouselImageId, dirtn) {
        this.axios.patch('/admin/carousel-image/' + carouselImageId + '/' + dirtn)
          .then(response => {
            this.getCarouselImages()
          })
          .catch(error => {
            console.log(error.response)
          })
      },
      showOrHideCarouselImage (carouselImageId) {
        this.axios.patch('/admin/carousel-image/' + carouselImageId + '/show-or-hide')
          .then(response => {
            this.getCarouselImages()
          })
          .catch(error => {
            console.log(error.response)
          })
      },
      showDeleteCarouselImageModal (carouselImage) {
        this.modals.deleteCarouselImage.data = carouselImage
        this.modals.deleteCarouselImage.show = true
      }
    }
  }
</script>

<style>
  .pointer {
    cursor: pointer;
  }
</style>