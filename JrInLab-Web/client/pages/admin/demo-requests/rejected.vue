<template>
  <v-card class="ma-4">
    <v-card-title>
      <span class="font-weight-bold headline">Rejected Requests</span>

      <nuxt-link class="ml-4" to="/admin/demo-requests">
        <small> Demo Requests </small>
      </nuxt-link>

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
      :footer-props="footerProps"
      :headers="headers"
      :items="requests"
      :loading="loading"
      :options.sync="options"
      :server-items-length="totalItems"
      calculate-widths
      item-class="error"
      loading-text="Loading... Please wait!"
      sort-by="updatedAt"
      sort-desc
      class="hidden-xs-only"
    >
      <template #[`item.index`]="{ item }"> {{ item.index + 1 }}. </template>
      <template #[`item.updatedAt`]="{ item }">
        {{ item.updatedAt | dateFilter }}
      </template>
      <template #[`item.laptop`]="{ item }">
        <v-icon :color="item.hasLaptop ? 'success' : 'error'">
          {{ item.hasLaptop ? '$mdiCheck' : '$mdiClose' }}
        </v-icon>
      </template>
      <template #[`item.source`]="{ item }">
        <div style="white-space: pre-line" v-text="item.source" />
      </template>
      <template #[`item.leadInfo`]="{ item }">
        <span class="font-weight-bold">{{ item.leadInfo.parent.value }}</span>
        <br />
        {{ item.leadInfo.kid }}
      </template>
      <template #[`item.phoneNo`]="{ item }">
        <a
          :href="item.contactInfo.phone.href"
          class="secondary--text"
          @click.stop=""
        >
          {{ item.contactInfo.phone.value }}
        </a>
        <small> ({{ item.contactInfo.phone.suffix }}) </small>
      </template>
      <template #[`item.emailId`]="{ item }">
        <a
          :href="item.contactInfo.email.href"
          class="secondary--text"
          @click.stop=""
        >
          {{ item.contactInfo.email.value }}
        </a>
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
      <template v-for="(request, index) in requests">
        <RequestItem
          :key="request.id"
          :request="request"
          :class="{ 'mt-2': index }"
        />
      </template>
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
      tab: null,
      search: '',
      page: 1,
      numItemsPerPage: 10,
      totalVisible: 5,
      filterMenu: false,
      filters: {
        status: null,
        source: null,
        campaign: null,
      },
      defaultHeaders: [
        { text: '#', sortable: false, value: 'index' },
        { text: `Updated`, value: 'updatedAt' },
        { text: `Laptop`, value: 'laptop' },
        { text: `Lead Source`, sortable: false, value: 'source' },
        { text: `Lead Info`, sortable: false, value: 'leadInfo' },
        { text: `Phone No`, sortable: false, value: 'phoneNo' },
        { text: `Email Id`, sortable: false, value: 'emailId' },
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
      hasFilters: false,
      searchDebounceTimer: null,
    }
  },
  computed: {
    ...mapGetters('admin', ['rejectedDemoRequests', 'metaData']),
    ...mapGetters('user', ['isSuperAdmin']),
    totalItems() {
      let totalItems = this.options.itemsPerPage
      if (this.requests) {
        const page = this.options.page
        totalItems =
          this.requests.length === this.options.itemsPerPage
            ? (page + 1) * this.options.itemsPerPage
            : (page - 1) * this.options.itemsPerPage + this.requests.length
      }

      return totalItems
    },
    numPages() {
      return Math.ceil(this.rejectedDemoRequests.length / this.numItemsPerPage)
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
    sources() {
      const sources = []
      if (this.metaData) {
        if (this.filters.campaign) {
          sources.push(...this.metaData.leads.campaigns[this.filters.campaign])
        } else {
          for (const source in this.metaData.leads.sources) {
            sources.push(source)
          }
        }
      }

      return sources
    },
    campaigns() {
      const campaigns = []
      if (this.metaData) {
        if (this.filters.source) {
          campaigns.push(...this.metaData.leads.sources[this.filters.source])
        } else {
          for (const campaign in this.metaData.leads.campaigns) {
            campaigns.push(campaign)
          }
        }
      }

      return campaigns
    },
    requests() {
      const query = { ...this.$route.query }
      const page = query.page || 1
      delete query.page

      const resolvedUrl = this.$router.resolve({
        path: '/admin/demo-requests/rejected',
        query,
      })

      console.log(`request url in computed: ${resolvedUrl.href}`)

      const requests = this.rejectedDemoRequests(resolvedUrl.href, page)

      console.log('requests in component: ', requests)

      return requests
    },
    headers() {
      const headers = [...this.defaultHeaders]
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
        const query = { ...this.$route.query }

        if (
          !localStorage.itemsPerPage ||
          options.itemsPerPage !== this.numItemsPerPage
        ) {
          localStorage.itemsPerPage = options.itemsPerPage
          this.numItemsPerPage = options.itemsPerPage
        }

        this.handleFilters(query)
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
          path: '/admin/demo-requests/rejected',
          query: { ...query },
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

          this.filters.status = query.status ? query.status.split(',') : null
          this.filters.source = query.source
          this.filters.campaign = query.campaign
          this.search = query.search
          if (query.status || query.source || query.campaign) {
            this.hasFilters = true
          }
        } else {
          this.$router.push(route)
        }
      },
      deep: true,
    },
    $route(to, from) {
      console.log(`watching route params: to: `, to, `, from: `, from)
      if (!Object.keys(to.query).length) {
        if (this.options.page !== 1) {
          console.log(`watching route params: trying to set the page to 1: `)
          this.options.page = 1
        } else {
          console.log(`watching route params: trying to set the query count: `)
          this.$router.push({
            path: '/admin/demo-requests/rejected',
            query: { count: this.options.itemsPerPage },
          })
        }

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
        this.filters.status = null
        this.filters.source = null
        this.filters.campaign = null

        if (this.options.page === 1) {
          const query = { count: this.$route.query.count }
          if (newVal) {
            query.search = newVal.toLowerCase()
          }

          console.log('changing route from search watch')

          this.$router.push({
            path: '/admin/demo-requests/rejected',
            query: { ...query },
          })
        } else {
          console.log('changing page to 1 from search watch')
          this.options.page = 1
        }
      }, 750)
    },
  },
  mounted() {
    console.log('mounted:: ', this.$route)

    if (localStorage.itemsPerPage) {
      this.numItemsPerPage = parseInt(localStorage.itemsPerPage)
      console.log('setting options.itemsPerPage: ', this.numItemsPerPage)

      this.options.itemsPerPage = this.numItemsPerPage
    }

    if (this.$route.query.page) {
      this.options.page = this.$route.query.page
    }
  },
  methods: {
    ...mapActions('admin', ['getRejectedDemoRequests', 'deleteCustomerEntry']),
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
    handleFilters(query) {
      let hasFilters = false
      if (this.filters.status && this.filters.status.length) {
        query.status = this.filters.status.sort().join()
        hasFilters = true
      }

      if (this.filters.source) {
        query.source = this.filters.source
        hasFilters = true
      }

      if (this.filters.campaign) {
        query.campaign = this.filters.campaign
        hasFilters = true
      }

      this.hasFilters = hasFilters
      console.log('setting hasFilters to: ', hasFilters)
    },
    applyFilters() {
      console.log('inside apply filters')
      if (this.options.page === 1) {
        const query = {}

        query.count = this.$route.query.count

        this.handleFilters(query)

        this.$router.push({
          path: '/admin/demo-requests/rejected',
          query: { ...query },
        })
      } else {
        console.log(
          `applyfilters: on page ${this.options.page} so force changing the page to 1`
        )

        this.options.page = 1
      }

      this.filterMenu = false
    },
    async fetchRequests(query) {
      this.loading = true

      const options = {
        campaign: query.campaign,
        count: query.count,
        search: query.search,
        source: query.source,
        status: query.status,
      }

      const resolvedUrl = this.$router.resolve({
        path: '/admin/demo-requests/rejected',
        query: { ...options },
      })

      options.page = query.page || 1

      options.route = resolvedUrl.href

      console.log('calling fetch requests: finalOptions: ', options)
      const resetToFirstPage = await this.getRejectedDemoRequests(options)
      if (resetToFirstPage) {
        this.options.page = 1
      }

      this.loading = false
    },
    editItem(item) {
      if (item) {
        this.$router.push(`/admin/demo-requests/rejected/${item.id}/edit`)
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
          const page = query.page || 1
          delete query.page

          const resolvedUrl = this.$router.resolve({
            path: '/admin/demo-requests/rejected',
            query,
          })

          await this.deleteCustomerEntry({
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
