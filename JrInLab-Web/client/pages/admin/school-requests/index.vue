<template>
  <v-card class="ma-4">
    <v-card-title>
      <span class="font-weight-bold headline">School Requests</span>
      <v-spacer />
      <v-text-field
        v-model="search"
        :append-icon="search ? '' : '$mdiMagnify'"
        class="search-text mr-3"
        clearable
        filled
        dense
        hide-details
        label="Search"
        single-line
      />
    </v-card-title>

    <v-divider />

    <v-data-table
      v-model="selected"
      :footer-props="footerProps"
      :headers="headers"
      :items="requests"
      :item-class="
        (item) => {
          return item.attended ? 'success darken-3' : ''
        }
      "
      :loading="loading"
      :options.sync="options"
      :server-items-length="totalItems"
      calculate-widths
      loading-text="Loading... Please wait!"
      sort-by="updatedAt"
      sort-desc
      class="hidden-xs-only"
      @click:row="onRowItemClick"
    >
      <template #expanded-item="{ item }">
        <td :colspan="headers.length" class="grey darken-3 px-4 py-3">
          <div v-if="item.message">
            <span class="font-weight-bold">Message:</span> {{ item.message }}
          </div>
          <template v-if="item.logCount && item.logs">
            <div
              v-for="(log, index) in getLogs(item.logs)"
              :key="log.id"
              :class="{ 'mt-2': index }"
              class="d-flex"
            >
              <strong>
                {{ log.author.name }} @ {{ log.createdAt | dateFilter }}
              </strong>
              <v-divider vertical dark class="mx-2 grey" />
              <v-chip v-if="log.status" outlined small label color="white">
                {{ log.status.old }} -> {{ log.status.new }}
              </v-chip>
              <v-divider vertical dark class="mx-2 grey" />
              {{ log.summary }}
              <v-spacer />
              <strong v-if="log.updatedAt">
                Last updated: {{ log.updatedAt | dateFilter }}
              </strong>
            </div>
          </template>
          <v-row v-else align="center" justify="center" no-gutters>
            <span> No interactions activity </span>
            <v-btn
              :to="`/admin/demo-requests/${item.id}`"
              color="primary"
              class="ml-4"
              small
            >
              <v-icon left> $mdiPlus </v-icon>
              Log Interaction
            </v-btn>
          </v-row>
        </td>
      </template>
      <template #[`item.index`]="{ item }"> {{ item.index + 1 }}. </template>
      <template #[`item.status`]="{ item }">
        <v-chip
          :color="states[item.status] ? states[item.status].color : ''"
          class="font-weight-bold"
          small
        >
          {{ item.status.toUpperCase() }}
        </v-chip>
      </template>
      <template #[`item.createdAt`]="{ item }">
        {{ item.createdAt | dateFilter }}
      </template>
      <template #[`item.updatedAt`]="{ item }">
        {{ item.updatedAt | dateFilter }}
      </template>
      <template #[`item.leadInfo`]="{ item }">
        <nuxt-link
          :to="item.leadInfo.name.to"
          no-prefetch
          class="secondary--text"
          @click.stop=""
        >
          {{ item.leadInfo.name.value }}
        </nuxt-link>
        <span class="ml-2">({{ item.leadInfo.role }})</span>
        <v-icon v-if="item.message" class="ml-1" small>
          $mdiMessageTextOutline
        </v-icon>
        <br />
        {{ item.leadInfo.school }}
      </template>
      <template #[`item.contactInfo`]="{ item }">
        <a :href="item.contactInfo.phone.href" class="secondary--text">
          {{ item.contactInfo.phone.value }}
        </a>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> $mdiPencil </v-icon>
        <v-icon small @click="deleteItem(item)"> $mdiDelete </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="deleting.dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Confirm Lead Deletion</span>
        </v-card-title>

        <v-card-text>
          Please confirm the demo request lead deletion by typing the parent's
          name below
          <v-text-field
            v-model="deleting.name"
            :error-messages="deleting.errors"
            label="Parent's name"
            class="mt-4"
          />

          <v-alert
            v-model="deleting.alert.show"
            :type="deleting.alert.type"
            prominent
            dismissible
            class="mt-4"
          >
            {{
              deleting.alert.type === 'success'
                ? deleting.alert.message.success
                : deleting.alert.message.failure
            }}
          </v-alert>
        </v-card-text>

        <v-card-actions class="pt-0 px-6 pb-5">
          <v-spacer />
          <v-btn color="error" text @click="cancelDelete">Cancel</v-btn>
          <v-btn
            :disabled="deleting.loading"
            :loading="deleting.loading"
            color="error"
            @click="confirmDelete"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="hidden-sm-and-up">
      <request-item
        v-for="(request, index) in requests"
        :key="request.id"
        :request="request"
        :class="{ 'mt-2': index }"
      />

      <v-pagination
        v-model="page"
        :length="numPages"
        :total-visible="totalVisible"
        class="my-4"
      />
    </div>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      search: '',
      page: 1,
      numItemsPerPage: 10,
      totalVisible: 5,
      defaultHeaders: [
        { text: '#', sortable: false, value: 'index' },
        { text: `Status`, sortable: false, value: 'status' },
        { text: `Created`, value: 'createdAt' },
        { text: `Updated`, value: 'updatedAt' },
        { text: `Lead Info`, sortable: false, value: 'leadInfo' },
        { text: `Contact info`, sortable: false, value: 'contactInfo' },
        { text: 'Logs', sortable: false, value: 'logCount' },
      ],
      selected: [],
      deleting: {
        dialog: false,
        item: null,
        name: null,
        loading: false,
        errors: [],
        alert: {
          show: false,
          type: 'success',
          message: {
            success: `Entry deleted successfully`,
            failure: `Oops! Failed to delete the entry, please try again later.`,
          },
        },
      },
      footerProps: {
        'items-per-page-options': [10, 15, 25, 50],
      },
      options: {},
      searchDebounceTimer: null,
    }
  },
  computed: {
    ...mapGetters('admin', ['schoolRequests', 'metaData']),
    ...mapGetters('user', ['isSuperAdmin']),
    totalItems() {
      let totalItems = this.options.itemsPerPage
      console.log(
        `================= this.options.itemsPerPage: ${this.options.itemsPerPage}, page: ${this.options.page}`
      )
      if (this.requests) {
        const page = this.options.page
        // console.log(
        //   `================= totalItems: page: ${page}, this.requests.length: ${this.requests.length}`
        // )
        totalItems =
          this.requests.length === this.options.itemsPerPage
            ? (page + 1) * this.options.itemsPerPage
            : (page - 1) * this.options.itemsPerPage + this.requests.length
      }

      // console.log(`================= returning totalItems: ${totalItems}`)

      return totalItems
    },
    numPages() {
      return Math.ceil(this.schoolRequests.length / this.numItemsPerPage)
    },
    states() {
      const states = {}
      if (this.metaData) {
        for (const state of this.metaData.global.states) {
          states[state.value] = { ...state }
        }
      }

      return states
    },
    requests() {
      const query = { ...this.$route.query }
      const page = query.page ? parseInt(query.page) : 1
      delete query.page

      const resolvedUrl = this.$router.resolve({
        path: '/admin/school-requests',
        query: this.getSortedQuery(query),
      })

      console.log(`request url in computed: ${resolvedUrl.href}`)

      const requests = this.schoolRequests(resolvedUrl.href, page)

      console.log('requests in component: ', requests)

      return requests
    },
    headers() {
      const headers = [...this.defaultHeaders]
      if (this.isSuperAdmin) {
        headers.push({
          text: 'Actions',
          value: 'actions',
          sortable: false,
          width: 96,
        })
      }

      return headers
    },
  },
  watch: {
    options: {
      handler(options) {
        console.log(
          `options handler:: this.numItemsPerPage: ${this.numItemsPerPage} `,
          options
        )
        // const query = { ...this.$route.query }
        const query = {}

        if (
          !localStorage.itemsPerPage ||
          options.itemsPerPage !== this.numItemsPerPage
        ) {
          localStorage.itemsPerPage = options.itemsPerPage
          this.numItemsPerPage = options.itemsPerPage
        }

        if (this.search) {
          query.search = this.search.toLowerCase()
        }

        if (options.page > 1) {
          query.page = options.page
        } else {
          delete query.page
        }

        query.count = options.itemsPerPage
        const route = {
          path: '/admin/school-requests',
          query: { ...this.getSortedQuery(query) },
        }
        const resolvedUrl = this.$router.resolve(route)
        console.log(
          `resolved Url : `,
          resolvedUrl,
          `, existingUrl: `,
          this.$route
        )

        if (resolvedUrl.route.fullPath === this.$route.fullPath) {
          this.fetchRequests(query)
          this.search = query.search
        } else {
          this.$router.push(route)
        }
      },
      deep: true,
    },
    $route(to, from) {
      console.log(`watching route params: to: `, to, `, from: `, from)
      if (!Object.keys(to.query).length) {
        this.resetFilters(true)
        return
      }

      console.log(`watching route params: calling fetch requests: `)
      this.fetchRequests(to.query)
    },
    search(newVal, oldVal) {
      console.log(`searchVal: new: ${newVal}, old: ${oldVal}`)
      if (this.searchDebounceTimer) {
        console.log(`calling clearTimeout for: ${this.searchDebounceTimer}`)
        clearTimeout(this.searchDebounceTimer)
      }

      if (!newVal && !oldVal) {
        console.log('returning from search watch as no old and new values')
        return
      }

      this.searchDebounceTimer = setTimeout(() => {
        if (this.options.page !== 1) {
          console.log('changing page to 1 from search watch')
          this.options.page = 1
          return
        }

        const query = { ...this.$route.query }
        if (newVal) {
          query.search = newVal.toLowerCase()
        } else if (query.search) {
          delete query.search
        }

        console.log('changing route from search watch')

        this.$router.push({
          path: '/admin/school-requests',
          query: { ...this.getSortedQuery(query) },
        })
      }, 750)
    },
  },
  beforeMount() {
    console.log('beforeMount:: ', this.$route)

    if (localStorage.itemsPerPage) {
      this.numItemsPerPage = parseInt(localStorage.itemsPerPage)
      console.log('setting options.itemsPerPage: ', this.numItemsPerPage)

      this.options.itemsPerPage = this.numItemsPerPage
    }

    if (this.$route.query.search) {
      this.search = this.$route.query.search
    }

    if (this.$route.query.page) {
      this.options.page = parseInt(this.$route.query.page)
    }
  },
  methods: {
    ...mapActions('admin', ['getSchoolRequests', 'deleteSchoolEntry']),
    getSortedQuery(query) {
      if (query) {
        const sortedQuery = {}
        Object.keys(query)
          .sort()
          .forEach((key) => {
            sortedQuery[key] = query[key]
          })

        return sortedQuery
      }
    },
    getLogs(logs) {
      const sortLogs = []

      for (const logId in logs) {
        sortLogs.push({ id: logId, ...logs[logId] })
      }

      sortLogs.sort((log1, log2) => {
        return log2.createdAt.toMillis() - log1.createdAt.toMillis()
      })

      return sortLogs
    },
    resetFilters(resetSearch) {
      if (resetSearch) {
        this.search = null
      }

      if (this.options.page === 1) {
        const query = {
          count: this.$route.query.count || this.options.itemsPerPage,
        }

        if (!resetSearch && this.$route.query.search) {
          query.search = this.$route.query.search
        }

        console.log('changing route from resetFilters')

        this.$router.push({
          path: '/admin/school-requests',
          query: { ...this.getSortedQuery(query) },
        })
      } else {
        console.log('changing page to 1 from resetFilters')
        this.options.page = 1
      }
    },
    async fetchRequests(query) {
      this.loading = true

      const options = {
        count: query.count,
        search: query.search,
      }

      const resolvedUrl = this.$router.resolve({
        path: '/admin/school-requests',
        query: { ...this.getSortedQuery(options) },
      })

      options.page = query.page ? parseInt(query.page) : 1

      options.route = resolvedUrl.href

      console.log('calling fetch requests: finalOptions: ', options)
      const resetToFirstPage = await this.getSchoolRequests(options)
      if (resetToFirstPage) {
        this.options.page = 1
      }

      this.loading = false
    },
    editItem(item) {
      if (item) {
        this.$router.push(`/admin/school-requests/${item.id}/edit`)
      }
    },
    deleteItem(item) {
      if (item) {
        this.deleting.item = { ...item }
        this.deleting.dialog = true
      }
    },
    cancelDelete() {
      this.deleting.dialog = false
      this.deleting.item = null
      this.deleting.name = null
      this.deleting.alert.show = false
      this.deleting.errors = []
    },
    async confirmDelete() {
      this.deleting.errors = []

      if (!this.deleting.name) {
        this.deleting.errors.push(
          `Please type the parent's name to delete this entry`
        )
      } else if (this.deleting.name !== this.deleting.item.parentsName) {
        this.deleting.errors.push(
          `Entered name doesn't match the Parent's name in the entry being deleted`
        )
      } else {
        this.deleting.loading = true
        try {
          const query = { ...this.$route.query }
          const page = query.page ? parseInt(query.page) : 1
          delete query.page

          const resolvedUrl = this.$router.resolve({
            path: '/admin/school-requests',
            query: this.getSortedQuery(query),
          })

          await this.deleteSchoolEntry({
            id: this.deleting.item.id,
            route: resolvedUrl.href,
            page,
          })
          this.deleting.alert.type = 'success'

          setTimeout(() => {
            this.cancelDelete()
          }, 2000)
        } catch (error) {
          console.log(error)
          this.deleting.alert.type = 'error'
        }

        this.deleting.loading = false
        this.deleting.alert.show = true
      }
    },
    onRowItemClick(item, options) {
      if (options) {
        options.expand(!options.isExpanded)
      }
    },
  },
}
</script>

<style scoped>
.search-text {
  max-width: 320px !important;
}
</style>
