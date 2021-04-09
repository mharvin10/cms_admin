<template>
  <v-layout column>
    <v-card flat class="transparent card--flex-toolbar">
      <v-toolbar card prominent>
        <v-toolbar-title class="title">Calendar (Holidays & Events)</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn small flat color="primary" dark @click="modals.createHolidayEvent.show = !modals.createHolidayEvent.show">
          Create Holiday/Event
        </v-btn>
      </v-toolbar>
      <v-progress-linear :indeterminate="true" height="2" class="ma-0" v-show="$store.state.progress"></v-progress-linear>
      <v-container grid-list-xl>
        <v-layout row wrap>
          <v-flex xs12 lg8>
            <v-date-picker
              full-width
              landscape
              v-model="date"
              :show-current="false"
              :picker-date.sync="pickerDate"
              color="primary lighten-1"
              header-color="primary"
              :event-color="calendar.holidayAndEventDatesColor"
              :events="calendar.holidayAndEventDates"
            ></v-date-picker>
          </v-flex>
          <v-flex xs12 lg11>
            <v-data-table
              dense
              :headers="table.headers"
              :items="calendar.holidaysAndEvents"
              v-model="table.selected"
              :pagination.sync="table.pagination"
              :search="table.search"
              no-data-text="No holidays/events for this month. Change the month in the calendar above to see holidays/events of that month."
              item-key="id"
              select-all="primary"
              hide-actions
              class="elevation-1"
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
                      {{ props.item.calendar_date }}
                    </v-layout>
                  </td>
                  <td>{{ props.item.title }}</td>
                  <td><span v-if="(props.item.type === 'holiday') && props.item.holiday_type">{{ props.item.holiday_type }}</span></td>
                  <td class="text-xs-right">
                    <v-tooltip bottom open-delay="700">
                      <span slot="activator" @click.stop="showEditHolidayEventModal(props.item.id)">
                        <i :class="$store.state.style.text.color.default" class="fas fa-pencil-alt pointer mr-1"></i>
                      </span>
                      <span>Edit</span>
                    </v-tooltip>
                    <v-tooltip bottom open-delay="700">
                      <span slot="activator" @click.stop="showDeleteHolidayEventModal(props.item)">
                        <i :class="$store.state.style.text.color.default" class="far fa-trash-alt pointer mr-1"></i>
                      </span>
                      <span>Delete</span>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>

    <!-- modals -->
    <create-holiday-event
      :props.sync="modals.createHolidayEvent"
      @holidayEventCreated="getMonthHolidaysAndEvents(pickerDate)"
    ></create-holiday-event>

    <edit-holiday-event
      :props.sync="modals.editHolidayEvent"
      @holidayEventEdited="getMonthHolidaysAndEvents(pickerDate)"
    ></edit-holiday-event>

    <delete-holiday-event
      :props.sync="modals.deleteHolidayEvent"
      @holidayEventDeleted="getMonthHolidaysAndEvents(pickerDate)"
    ></delete-holiday-event>

  </v-layout>
</template>

<script>
  import CreateHolidayEvent from './modals/CreateHolidayEvent.vue'
  import EditHolidayEvent from './modals/EditHolidayEvent.vue'
  import DeleteHolidayEvent from './modals/DeleteHolidayEvent.vue'

  export default {
    components: {
      CreateHolidayEvent,
      EditHolidayEvent,
      DeleteHolidayEvent
    },
    data () {
      return {
        date: null,
        pickerDate: null,
        calendar: {
          holidaysAndEvents: [],
          holidayAndEventDates: [],
          holidayAndEventDatesColor: {}
        },
        table: {
          headers: [
            {
              text: 'Date',
              value: 'calendar_date',
              width: '15%'
            },
            {
              text: 'Title',
              value: 'title',
              width: '45%'
            },
            {
              // text: '',
              sortable: false,
              width: '25%'
            },
            {
              // text: '',
              sortable: false,
              width: '15%'
            }
          ],
          selected: [],
          search: '',
          pagination: {
            sortBy: 'calendar_date',
            descending: true,
            rowsPerPage: -1
          }
        },
        modals: {
          createHolidayEvent: {
            show: false
          },
          editHolidayEvent: {
            show: false,
            data: {}
          },
          deleteHolidayEvent: {
            show: false,
            data: {}
          }
        }
      }
    },
    watch: {
      pickerDate (val) {
        this.getMonthHolidaysAndEvents(val)
      }
    },
    created () {
      //
    },
    methods: {
      getMonthHolidaysAndEvents (month) {
        this.$store.commit('SHOW_PROGRESS_BAR')
        this.axios.get('/admin/calendar-dates/' + month + '/holidays-and-events')
          .then(response => {
            // console.log(response.data)
            this.calendar.holidaysAndEvents = response.data
            this.calendar.holidayAndEventDates = response.data.map(item => item.calendar_date)

            this.calendar.holidayAndEventDatesColor = response.data.reduce(function (item, obj) {
              item[obj.calendar_date] = obj.type === 'holiday' ? 'red darken-1' : 'primary darken-1'
              return item
            }, {})
            this.$store.commit('HIDE_PROGRESS_BAR')
          })
          .catch(error => {
            this.$store.commit('HIDE_PROGRESS_BAR')
            console.log(error.response)
          })
      },
      showEditHolidayEventModal (calendarDateId) {
        this.axios.get('/admin/calendar-date/' + calendarDateId)
          .then(response => {
            // console.log(response.data)
            this.modals.editHolidayEvent.data = response.data
            this.modals.editHolidayEvent.show = true
          })
          .catch(error => {
            console.log(error)
          })
      },
      showDeleteHolidayEventModal (calendarDate) {
        this.modals.deleteHolidayEvent.data = calendarDate
        this.modals.deleteHolidayEvent.show = true
      }
    }
  }
</script>

<style>
  .pointer {
    cursor: pointer;
  }
</style>