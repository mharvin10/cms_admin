<template>
  <v-container fluid grid-list-xl>
    <v-progress-linear :indeterminate="true" height="2" class="ma-0" v-show="$store.state.progress"></v-progress-linear>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap>
        <v-flex xs12 md6>
          <v-layout row wrap>
            <v-flex xs12 md6>
              <v-card>
                <div class="body-2 pt-2 px-2">Visitors</div>
                <v-card-text class="display-1">
                  <div>{{ hitsOverview.visitors }}</div>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 md6>
              <v-card>
                <div class="body-2 pt-2 px-2">Sessions</div>
                <v-card-text class="display-1">
                  {{ hitsOverview.sessions }}
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 md6>
              <v-card>
                <div class="body-2 pt-2 px-2">Number of Sessions per Visitor</div>
                <v-card-text class="display-1">
                  {{ hitsOverview.sessionsPerUser }}
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 md6>
              <v-card>
                <div class="body-2 pt-2 px-2">Pageviews</div>
                <v-card-text class="display-1">
                  {{ hitsOverview.pageViews }}
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 md6>
              <v-card>
                <div class="body-2 pt-2 px-2">Pages/Session</div>
                <v-card-text class="display-1">
                  {{ hitsOverview.pageviewsPerSession }}
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 md6>
              <v-card>
                <div class="body-2 pt-2 px-2">Avg. Session Duration</div>
                <v-card-text class="display-1">
                  {{ hitsOverview.avgSessionDuration }}
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-card class="card--flex-toolbar">
                <v-toolbar card prominent dense>
                  <v-toolbar-title class="body-2">Top 5 Cities</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                  <top-cities-bar-chart
                    :chart-data="topCities"
                    :width="400"
                    :height="200"
                  ></top-cities-bar-chart>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 md6>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card class="card--flex-toolbar">
                <v-toolbar card prominent dense>
                  <v-toolbar-title class="body-2">Website Hits<br><span class="caption">For the last 7 days</span></v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                  <visits-line-chart
                    :chart-data="visits"
                    :width="400"
                    :height="200"
                  ></visits-line-chart>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <div class="body-2 mb-1">Website Content Statistics</div>
              <v-data-table
                :headers="headers"
                :items="items"
                hide-actions
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.name }}</td>
                  <td class="text-xs-center">{{ props.item.calories }}</td>
                  <td class="text-xs-center">{{ props.item.fat }}</td>
                  <!-- <td class="text-xs-right">{{ props.item.carbs }}</td>
                  <td class="text-xs-right">{{ props.item.protein }}</td>
                  <td class="text-xs-right">{{ props.item.iron }}</td> -->
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
  import VisitsLineChart from './charts/LineChart.js'
  import TopCitiesBarChart from './charts/BarChart.js'

  export default {
    components: {
      VisitsLineChart,
      TopCitiesBarChart
    },
    data () {
      return {
        hitsOverview: {
          visitors: null,
          sessions: null,
          pageViews: null,
          sessionsPerUser: null,
          avgSessionDuration: null,
          pageviewsPerSession: null
        },
        visits: null,
        topCities: null,
        headers: [
          {
            text: 'Component',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Active', align: 'center', value: 'calories' },
          { text: 'Total', align: 'center', value: 'fat' }
          // { text: 'Carbs (g)', value: 'carbs' },
          // { text: 'Protein (g)', value: 'protein' },
          // { text: 'Iron (%)', value: 'iron' }
        ],
        items: [
          {
            value: false,
            name: 'Pages & Sections',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%'
          },
          {
            value: false,
            name: 'News',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%'
          },
          {
            value: false,
            name: 'Annoucements',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%'
          },
          {
            value: false,
            name: 'Job Vacancies',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%'
          },
          {
            value: false,
            name: 'Events & Holidays',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%'
          },
          {
            value: false,
            name: 'Carousel Items',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%'
          },
          {
            value: false,
            name: 'Albums',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%'
          }
        ]
      }
    },
    mounted () {
      this.getTotalHitsOverview()
      this.getVisits()
      this.getTopCities()
    },
    methods: {
      getTotalHitsOverview () {
        this.$store.commit('SHOW_PROGRESS_BAR')
        this.axios.get('/admin/total-hits-overview').then(response => {
          // console.log(response.data)
          this.hitsOverview.visitors = response.data.users
          this.hitsOverview.sessions = response.data.sessions
          this.hitsOverview.pageViews = response.data.pageViews
          this.hitsOverview.sessionsPerUser = response.data.sessionsPerUser
          this.hitsOverview.avgSessionDuration = response.data.avgSessionDuration
          this.hitsOverview.pageviewsPerSession = response.data.pageviewsPerSession
          this.$store.commit('HIDE_PROGRESS_BAR')
        })
        .catch(error => {
          this.$store.commit('HIDE_PROGRESS_BAR')
          console.log(error.response)
        })
      },
      getVisits () {
        this.axios.get('/admin/weekly-hits-line-chart').then(response => {
          // console.log(response.data)
          this.visits = {
            labels: response.data.date,
            datasets: [
              {
                label: 'Visitors',
                backgroundColor: '#4CAF50',
                data: response.data.users
              },
              {
                label: 'Sessions',
                backgroundColor: '#FF8A80',
                data: response.data.sessions
              },
              {
                label: 'Pageviews',
                backgroundColor: '#2196F3',
                data: response.data.pageViews
              }
            ]
          }
        })
        .catch(error => {
          console.log(error.response)
        })
      },
      getTopCities () {
        this.axios.get('/admin/top-cities-bar-chart').then(response => {
          // console.log(response.data)
          this.topCities = {
            labels: response.data.cities,
            datasets: [
              {
                label: 'Sessions',
                backgroundColor: '#FF8A80',
                data: response.data.sessions
              }
            ]
          }
        })
        .catch(error => {
          console.log(error.response)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
