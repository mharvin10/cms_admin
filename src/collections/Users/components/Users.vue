<template>
  <v-layout column>
    <v-card flat class="card--flex-toolbar">
      <v-toolbar card prominent>
        <v-toolbar-title class="title mr-3">Administrators</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="table.search"
        ></v-text-field>
        <div class="caption mx-3">{{ countAdministrators }} administrators</div>
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
                {{ props.item.name }}
              </v-layout>
            </td>
            <td>{{ props.item.created_at }}</td>
            <td>{{ props.item.updated_at }}</td>
            <td class="text-xs-right">
              <v-tooltip bottom open-delay="700">
                <span slot="activator" @click.stop="showResetPasswordModal(props.item.id)">
                  <i :class="$store.state.style.text.color.default" class="fas fa-lock pointer mr-1"></i>
                </span>
                <span>Reset password</span>
              </v-tooltip>
              <v-tooltip bottom open-delay="700">
                <span slot="activator" @click.stop="showAssignComponentsModal(props.item.id)">
                  <i :class="$store.state.style.text.color.default" class="far fa-object-group pointer mr-1"></i>
                </span>
                <span>Assign components</span>
              </v-tooltip>
              <v-tooltip bottom open-delay="700">
                <span slot="activator" @click.stop="showRenameModal(props.item.id)">
                  <i :class="$store.state.style.text.color.default" class="far fa-edit pointer mr-1"></i>
                </span>
                <span>Rename</span>
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
    <create-user
      :props.sync="modals.create"
      @userCreated="getUsers"
    ></create-user>

    <rename-user
      :props.sync="modals.rename"
      @userRenamed="getUsers"
    ></rename-user>

    <assign-components
      :props.sync="modals.assignComponents"
      @componentsAssigned="getUsers"
    ></assign-components>

    <reset-password
      :props.sync="modals.resetPassword"
      @passwordReseted="getUsers"
    ></reset-password>

    <delete-user
      :props.sync="modals.delete"
      @userDeleted="getUsers"
    ></delete-user>

  </v-layout>
</template>

<script>
  import CreateUser from './modals/CreateUser'
  import RenameUser from './modals/RenameUser'
  import AssignComponents from './modals/AssignComponents'
  import ResetPassword from './modals/ResetPassword'
  import DeleteUser from './modals/DeleteUser'

  export default {
    components: {
      CreateUser,
      RenameUser,
      AssignComponents,
      ResetPassword,
      DeleteUser
    },
    data () {
      return {
        news: {
          items: []
        },
        table: {
          headers: [
            {
              text: 'Name',
              value: 'name',
              width: '45%'
            },
            {
              text: 'Date created',
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
            sortBy: 'posted_at',
            descending: true,
            rowsPerPage: -1
          }
        },
        modals: {
          create: {
            show: false
          },
          rename: {
            show: false,
            data: {}
          },
          assignComponents: {
            show: false,
            data: {}
          },
          resetPassword: {
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
      this.getUsers()
    },
    computed: {
      countAdministrators () {
        return this.news.items ? this.news.items.length : 0
      }
    },
    methods: {
      getUsers () {
        this.$store.commit('SHOW_PROGRESS_BAR')
        this.axios.get('/admin/users')
          .then(response => {
            this.news.items = response.data
            this.$store.commit('HIDE_PROGRESS_BAR')
          })
          .catch(error => {
            this.$store.commit('HIDE_PROGRESS_BAR')
            console.log(error.response)
          })
      },
      getUser (userId) {
        return this.axios.get('/admin/user/' + userId)
      },
      showRenameModal (userId) {
        this.getUser(userId)
          .then(response => {
            this.modals.rename.data = {
              id: response.data.id,
              name: response.data.name,
              username: response.data.username,
              email: response.data.email
            }
            this.modals.rename.show = true
          })
          .catch(error => {
            console.log(error)
          })
      },
      showAssignComponentsModal (userId) {
        this.getUser(userId)
          .then(response => {
            this.modals.assignComponents.data = {
              id: response.data.id,
              components: response.data.components
            }
            this.modals.assignComponents.show = true
          })
          .catch(error => {
            console.log(error)
          })
      },
      showResetPasswordModal (userId) {
        this.getUser(userId)
          .then(response => {
            this.modals.resetPassword.data = {
              id: response.data.id
            }
            this.modals.resetPassword.show = true
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