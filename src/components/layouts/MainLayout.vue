<template>
  <v-layout>
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
    >
      <v-list dense expand>
        <template v-for="item in items">
          <v-layout
            row
            v-if="item.heading"
            align-center
            :key="item.heading"
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            v-model="item.open"
            :key="item.text"
            :prepend-icon="item.icon"
            no-action
          >
            <v-list-tile slot="activator" :disabled="item.disabled">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="item in item.children" :key="item.text" :to="item.url" :disabled="item.disabled">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>{{ item.action }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else @click="" :key="item.text" :to="item.url" :disabled="item.disabled">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
      <!-- <v-footer color="transparent" height="auto" app>
        <v-layout column align-center justify-center>
          <img src="/static/images/logo/mendez_tech.png" width="50%" alt="">
          <a class="caption mb-2">www.mendeztech.ph</a>
        </v-layout>
      </v-footer> -->
    </v-navigation-drawer>
    <v-toolbar
      color="primary"
      dark
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down"><!-- MT&trade; --> CMS</span>
      </v-toolbar-title>
      <v-btn flat>Municipality of Basud</v-btn>
      <!-- <v-text-field
        solo
        prepend-icon="search"
        placeholder="Search"
        class="hidden-sm-and-down"
      ></v-text-field> -->
      <v-spacer></v-spacer>
      <!-- <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn> -->
      <v-btn flat @click="logout()">
        Logout
      </v-btn>
      <!-- <v-btn icon large>
        <v-avatar size="38px" tile>
          <img
            src="@/assets/logo/mendez_tech_2.png"
            alt="Mendeztech"
          >
        </v-avatar>
      </v-btn> -->
    </v-toolbar>
    <v-content>
      <!-- <v-container fluid fill-height> -->
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
      <!-- </v-container> -->
    </v-content>

    <!-- loading screen -->
    <v-layout v-if="$store.state.loading" class="overlay overlay--active" style="z-index:999">
      <v-card class="yellow lighten-4 text-xs-center" width="90" height="20" style="margin:0 auto" tile>
        <div class="caption"><v-progress-circular indeterminate :size="11" color="deep-orange accent-1"></v-progress-circular> Processing...</div>
      </v-card>
    </v-layout>
    <!-- end loading screen  -->
  </v-layout>
</template>

<script>
  export default {
    props: {
      source: String
    },
    data: () => ({
      dialog: false,
      drawer: null,
      items: []
    }),
    created () {
      this.getUserComponents()
    },
    methods: {
      getUserComponents () {
        this.axios.get('/admin/user/components/auth')
          .then(response => {
            const components = response.data
            this.items = [
              { icon: 'people_outline', text: 'Administrators', url: '/administrators', disabled: !components.includes('administrators') },
              { icon: 'collections_bookmark', text: 'Webpages', url: '/webpages', disabled: !components.includes('webpages') },
              {
                icon: 'menu',
                text: 'Navigations (Menus)',
                // open: true,
                children: [
                  { text: 'Main menu', url: '/main-menus', disabled: !components.includes('main_menu') },
                  { text: 'Links', url: '/links', disabled: !components.includes('links') }
                ]
              },
              {
                icon: 'update',
                text: 'Posts (Updates)',
                open: true,
                children: [
                  { text: 'News', url: '/news', disabled: !components.includes('news') },
                  { text: 'Announcements', url: '/announcements', disabled: !components.includes('announcements') },
                  { text: 'Job Vacancies', url: '/vacancies', disabled: !components.includes('job_vacancies') }
                ]
              },
              { icon: 'wallpaper', text: 'Carousel', url: '/carousel', disabled: !components.includes('carousel') },
              { icon: 'date_range', text: 'Calendar (Holidays & Events)', url: '/calendar', disabled: !components.includes('calendar') },
              {
                icon: 'photo_library',
                text: 'Photo library',
                // open: true,
                children: [
                  { text: 'Albums', url: '/albums', disabled: !components.includes('albums') },
                  { text: 'Photos', disabled: true }
                ]
              }
            ]
          })
          .catch(error => {
            console.log(error.response)
          })
      },
      logout () {
        this.$auth.logout()
        this.$router.push('/login')
      }
    }
  }
</script>
