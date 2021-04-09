<template>
  <v-layout column fill-height>
    <template v-if="error === 'not_found'">
      <v-container fluid fill-height justify-center>
        <div>The page or section does not exist</div>
        <v-btn flat small @click="$router.push('/webpages')" color="primary">Go to webpages</v-btn>
      </v-container>
    </template>
    <template v-else>
      <!-- <div v-if="page.ancestors.length" class="white py-2 pl-3">
        <template v-for="(item, i) in page.ancestors">
          <span class="caption primary--text pointer" @click="getPageNodes(item.id)">{{ item.title }}</span> {{ page.ancestors.length === (i+1) ? '' : ('/&nbsp;') }}
        </template>
      </div> -->
      <v-breadcrumbs class="mx-3 my-2 pa-0">
        <v-icon slot="divider">chevron_right</v-icon>
        <v-breadcrumbs-item
          v-for="item in page.ancestors"
          :key="item.url"
          :disabled="item.type === 'section'"
          :to="item.url"
          @click.native="getPageNodes(item.id)"
        >
          {{ item.title }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-card flat class="card--flex-toolbar">
        <v-toolbar card prominent class="headline">
          <v-toolbar-title>
            <div>
              <template v-if="page.ancestors.length">
                <v-menu bottom right>
                  <i slot="activator" class="fas fa-caret-down pointer mr-2"></i>
                  <v-list dense>
                    <v-list-tile @click="showRenamePageModal(page.data.id)">
                      <v-list-tile-title>
                        <i :class="$store.state.style.text.color.default" class="fas fa-pencil-alt mr-2"></i> Rename
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile v-show="page.data.isPage" @click="showEditPageContentModal(page.data.id)">
                      <v-list-tile-title>
                        <i :class="$store.state.style.text.color.default" class="far fa-edit mr-2"></i> Edit content
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile v-show="page.data.isPage" @click="showEditPageSettingsModal(page.data.id)">
                      <v-list-tile-title>
                        <i :class="$store.state.style.text.color.default" class="fas fa-cogs mr-1"></i> Advanced settings
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="showOrHidePageNode(page.data.id)">
                      <v-list-tile-title>
                        <i :class="$store.state.style.text.color.default + (page.data.hidden ? ' fa-eye' : ' fa-eye-slash')" class="fas mr-2"></i> {{ page.data.hidden ? 'Show' : 'Hide' }}
                      </v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </template>
              <span v-if="page.ancestors.length">{{ page.data.isPage ? 'Page' : 'Section' }}:&nbsp;</span>
              <span :class="(page.data.hidden ? $store.state.style.text.color.disabled : '')">{{ page.data.title }}&nbsp;</span>
              <span v-if="page.data.hidden" :class="$store.state.style.text.color.disabled">(Hidden)&nbsp;</span>
            </div>
          </v-toolbar-title>
          <v-toolbar-title slot="extension" class="body-2">Pages & Sections</v-toolbar-title>
          <v-spacer slot="extension"></v-spacer>
          <div slot="extension" class="caption mr-2">{{ childrenCount }} pages</div>
          <v-menu
            v-if="page.data.depth <= 2"
            slot="extension"
            origin="center center"
            transition="scale-transition"
            bottom
            left
            offset-y
          >
            <v-btn small color="primary" dark slot="activator">
              Create
            </v-btn>
            <v-list dense class="pa-0">
              <v-list-tile @click="">
                <v-list-tile-title @click="showCreatePageModal(page.data)">
                  <i :class="$store.state.style.text.color.default" class="far fa-file-alt fa-lg mr-2"></i> New page
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile v-if="page.data.depth < 2" @click="showCreateSectionModal(page.data)">
                <v-list-tile-title><i :class="$store.state.style.text.color.default" class="far fa-folder fa-lg mr-1"></i> New section</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar>
        <v-progress-linear :indeterminate="true" height="2" class="ma-0" v-show="$store.state.progress"></v-progress-linear>
          <v-data-table
            :headers="table.headers"
            :items="page.children"
            v-model="table.selected"
            item-key="id"
            select-all="primary"
            hide-actions
            class="elevation-1"
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
                  <v-layout align-center :class="props.item.depth > 2 ? 'disabled-pointer-events' : 'pointer'" @click="getPageNodes(props.item.id)">
                    <i :class="(props.item.hidden ? $store.state.style.text.color.disabled : $store.state.style.text.color.default) + (props.item.isPage ? ' fa-file-alt mr-2' : ' fa-folder mr-1')" class="far fa-lg"></i>
                    {{ props.item.title }}
                  </v-layout>
                </td>
                <td>{{ props.item.created_at }}</td>
                <td>{{ props.item.updated_at }}</td>
                <td class="text-xs-right">
                  <v-tooltip bottom open-delay="700">
                    <span slot="activator" @click.stop="movePageNode(props.item.id, 'up')">
                      <i :class="$store.state.style.text.color.default" class="fas fa-chevron-up pointer mr-1"></i>
                    </span>
                    <span>Move up</span>
                  </v-tooltip>
                  <v-tooltip bottom open-delay="700">
                    <span slot="activator" @click.stop="movePageNode(props.item.id, 'down')">
                      <i :class="$store.state.style.text.color.default" class="fas fa-chevron-down pointer mr-1"></i>
                    </span>
                    <span>Move down</span>
                  </v-tooltip>
                  <v-tooltip bottom open-delay="700">
                    <span slot="activator" @click.stop="showSettingsMenu($event, props.item)">
                      <i :class="$store.state.style.text.color.default" class="fas fa-cog pointer mr-1"/>
                    </span>
                    <span>Settings</span>
                  </v-tooltip>
                  <v-tooltip bottom open-delay="700">
                    <span v-if="props.item.created_by" slot="activator" @click.stop="showDeletePageNodeModal(props.item)">
                      <i :class="$store.state.style.text.color.default" class="far fa-trash-alt pointer mr-1"/>
                    </span>
                    <span v-else slot="activator">
                      <i :class="$store.state.style.text.color.disabled" class="far fa-trash-alt pointer mr-1"/>
                    </span>
                    <span>Delete</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
          </v-data-table>
      </v-card>
    </template>

    <!-- settings menu -->
    <v-menu
      offset-y
      v-model="menus.settings.show"
      absolute
      :position-x="menus.settings.x"
      :position-y="menus.settings.y"
      @input="initMenus()"
    >
      <v-list dense>
        <v-list-tile @click="showRenamePageModal(menus.settings.item.id)">
          <v-list-tile-title>
            <i :class="$store.state.style.text.color.default" class="fas fa-pencil-alt mr-2"></i> Rename
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-show="menus.settings.item.isPage" @click="showEditPageContentModal(menus.settings.item.id)">
          <v-list-tile-title>
            <i :class="$store.state.style.text.color.default" class="far fa-edit mr-2"></i> Edit content
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-show="menus.settings.item.isPage" @click="showEditPageSettingsModal(menus.settings.item.id)">
          <v-list-tile-title>
            <i :class="$store.state.style.text.color.default" class="fas fa-cogs mr-1"></i> Advanced settings
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="showOrHidePageNode(menus.settings.item.id)">
          <v-list-tile-title>
            <i :class="$store.state.style.text.color.default + (menus.settings.item.hidden ? ' fa-eye' : ' fa-eye-slash')" class="fas mr-2"></i> {{ menus.settings.item.hidden ? 'Show' : 'Hide' }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <!-- modals -->
    <create-page
      :props.sync="modals.createPage"
      @pageCreated="initPageNodeTable"
    ></create-page>

    <create-section
      :props.sync="modals.createSection"
      @sectionCreated="initPageNodeTable"
    ></create-section>

    <rename-page-node
      :props.sync="modals.renamePageNode"
      @pageNodeRenamed="initPageNodeTable"
    ></rename-page-node>

    <edit-page-content
      :props.sync="modals.editPageContent"
      @pageContentEdited="initPageNodeTable"
    ></edit-page-content>

    <edit-page-settings
      :props.sync="modals.editPageSettings"
      @pageSettingsEdited="initPageNodeTable"
    ></edit-page-settings>

    <delete-page-node
      :props.sync="modals.deletePageNode"
      @pageNodeDeleted="initPageNodeTable"
    ></delete-page-node>

  </v-layout>
</template>

<script>
  import CreatePage from './modals/CreatePage.vue'
  import CreateSection from './modals/CreateSection.vue'
  import RenamePageNode from './modals/RenamePageNode.vue'
  import EditPageContent from './modals/EditPageContent.vue'
  import EditPageSettings from './modals/EditPageSettings.vue'
  import DeletePageNode from './modals/DeletePageNode.vue'

  export default {
    components: {
      CreatePage,
      CreateSection,
      RenamePageNode,
      EditPageContent,
      EditPageSettings,
      DeletePageNode
    },
    data () {
      return {
        page: {
          data: [],
          children: [],
          ancestors: []
        },
        table: {
          headers: [
            {
              text: 'Title',
              sortable: false,
              value: 'title',
              width: '45%'
            },
            {
              text: 'Date created',
              sortable: false,
              value: 'created_at',
              width: '20%'
            },
            {
              text: 'Date updated',
              sortable: false,
              value: 'updated_at',
              width: '20%'
            },
            {
              text: '',
              sortable: false,
              width: '15%'
            }
          ],
          selected: []
        },
        menus: {
          settings: Object
        },
        modals: {
          createPage: {
            show: false,
            data: {}
          },
          createSection: {
            show: false,
            data: {}
          },
          renamePageNode: {
            show: false,
            data: {}
          },
          editPageContent: {
            show: false,
            data: {}
          },
          deletePageNode: {
            show: false,
            data: {}
          },
          editPageSettings: {
            show: false,
            data: {}
          }
        },
        error: null
      }
    },
    watch: {
      '$route': {
        handler () {
          this.error = null
          this.initPageNodeTable()
        },
        deep: true
      }
    },
    created () {
      this.initPageNodeTable()
      this.initMenus()
    },
    computed: {
      childrenCount () {
        return this.page.children ? this.page.children.length : 0
      }
    },
    methods: {
      initPageNodeTable () {
        if (this.$route.query.pn) {
          this.getPageNodes(this.$route.query.pn)
        } else {
          this.getPageNodes()
        }
      },
      initMenus () {
        this.menus.settings = {
          show: false,
          item: Object,
          x: 0,
          y: 0
        }
      },
      getPageNodes (pn = null) {
        var pageNode = ''
        if (pn) {
          pageNode = '/' + pn
          this.$router.push({
            query: { pn: pn }
          })
        }
        this.$store.commit('SHOW_PROGRESS_BAR')
        this.axios.get('/admin/page-nodes/parent' + pageNode)
          .then(response => {
            // console.log(response.data)
            this.page = response.data
            this.$store.commit('HIDE_PROGRESS_BAR')
          })
          .catch(error => {
            this.$store.commit('HIDE_PROGRESS_BAR')
            console.log(error.response)
            if (error.response.status === 404) {
              this.error = 'not_found'
            }
          })
      },
      getPageNode (pageNodeId) {
        return this.axios.get('/admin/page-node/' + pageNodeId)
      },
      getPage (pageNodeId) {
        return this.axios.get('/admin/page/' + pageNodeId)
      },
      showSettingsMenu (event, item) {
        this.menus.settings.show = false
        this.menus.settings.item = item
        this.menus.settings.x = event.clientX
        this.menus.settings.y = event.clientY
        this.$nextTick(() => {
          this.menus.settings.show = true
        })
      },
      showCreatePageModal (pageNode) {
        this.modals.createPage.data = {
          parent: pageNode,
          children: this.page.children
        }
        this.modals.createPage.show = true
      },
      showCreateSectionModal (pageNode) {
        this.modals.createSection.data = {
          parent: pageNode,
          children: this.page.children
        }
        this.modals.createSection.show = true
      },
      showRenamePageModal (pageNodeId) {
        this.getPageNode(pageNodeId)
          .then(response => {
            // console.log(response.data)
            this.modals.renamePageNode.data = {
              id: response.data.id,
              title: response.data.title,
              short_title: response.data.short_title,
              isPage: response.data.isPage
            }
            this.modals.renamePageNode.show = true
          })
          .catch(error => {
            console.log(error)
          })
      },
      showEditPageContentModal (pageNodeId) {
        this.getPage(pageNodeId)
          .then(response => {
            // console.log(response.data)
            this.modals.editPageContent.data = {
              id: response.data.id,
              title: response.data.title,
              body: response.data.body
            }
            this.modals.editPageContent.show = true
          })
          .catch(error => {
            console.log(error)
          })
      },
      showEditPageSettingsModal (pageNodeId) {
        this.getPage(pageNodeId)
          .then(response => {
            // console.log(response.data)
            this.modals.editPageSettings.data = {
              id: response.data.id,
              slug: response.data.slug,
              redirect_url: response.data.redirect_url,
              header_image: response.data.header_image,
              hidden: response.data.hidden
            }
            this.modals.editPageSettings.show = true
          })
          .catch(error => {
            console.log(error)
          })
      },
      showOrHidePageNode (pageNodeId) {
        this.axios.patch('/admin/page-node/' + pageNodeId + '/show-or-hide')
          .then(response => {
            this.initPageNodeTable()
          })
          .catch(error => {
            console.log(error.response)
          })
      },
      movePageNode (pageNodeId, dirtn) {
        this.axios.patch('/admin/page-node/' + pageNodeId + '/' + dirtn)
          .then(response => {
            this.initPageNodeTable()
          })
          .catch(error => {
            console.log(error.response)
          })
      },
      showDeletePageNodeModal (pageNode) {
        this.modals.deletePageNode.data = pageNode
        this.modals.deletePageNode.show = true
      }
    }
  }
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }
  .disabled-pointer-events {
    pointer-events: none;
  }
</style>
