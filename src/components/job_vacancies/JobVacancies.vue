<template>
  <v-layout column>
    <v-card flat class="card--flex-toolbar">
      <v-toolbar card prominent>
        <v-toolbar-title class="title mr-3">Job Vacancies</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="table.search"
        ></v-text-field>
        <div class="caption mx-3">{{ countJobVacancies }} job vacancies</div>
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
            <td>{{ props.item.closing_date }}</td>
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
    <create-job-vacancy
      :props.sync="modals.create"
      @jobVacancyCreated="getJobVacancies"
    ></create-job-vacancy>

    <edit-job-vacancy
      :props.sync="modals.edit"
      @jobVacancyEdited="getJobVacancies"
    ></edit-job-vacancy>

    <delete-job-vacancy
      :props.sync="modals.delete"
      @jobVacancyDeleted="getJobVacancies"
    ></delete-job-vacancy>

  </v-layout>
</template>

<script>
  import CreateJobVacancy from './modals/CreateJobVacancy'
  import EditJobVacancy from './modals/EditJobVacancy'
  import DeleteJobVacancy from './modals/DeleteJobVacancy'

  export default {
    components: {
      CreateJobVacancy,
      EditJobVacancy,
      DeleteJobVacancy
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
              width: '40%'
            },
            {
              text: 'Closing date',
              value: 'closing_date',
              width: '15%'
            },
            {
              text: 'Date posted',
              value: 'posted_at',
              width: '15%'
            },
            {
              text: 'Date updated',
              value: 'updated_at',
              width: '15%'
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
      this.getJobVacancies()
    },
    computed: {
      countJobVacancies () {
        return this.news.items ? this.news.items.length : 0
      }
    },
    methods: {
      getJobVacancies () {
        this.$store.commit('SHOW_PROGRESS_BAR')
        this.axios.get('/admin/job-vacancies')
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
      getJobVacancy (jobVacancyId) {
        return this.axios.get('/admin/job-vacancy/' + jobVacancyId)
      },
      showEditModal (jobVacancyId) {
        this.getJobVacancy(jobVacancyId)
          .then(response => {
            // console.log(response.data)
            this.modals.edit.data = {
              id: response.data.id,
              title: response.data.title,
              closing_date: response.data.closing_date,
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