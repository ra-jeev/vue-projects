<template>
  <v-card class="ma-4">
    <v-card-title>
      <span class="font-weight-bold headline">Demo Requests</span>

      <nuxt-link class="ml-4" to="/admin/demo-requests/rejected">
        <small> View Rejected Demos </small>
      </nuxt-link>

      <v-btn
        class="ml-4"
        color="success"
        small
        @click="leadDialog = !leadDialog"
      >
        Add Lead
        <v-icon right small> $mdiAccountPlus </v-icon>
      </v-btn>
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

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            :color="hasFilters ? 'primary' : ''"
            icon
            v-on="on"
            @click="filterMenu = !filterMenu"
          >
            <v-icon> $mdiFilter </v-icon>
          </v-btn>
        </template>
        <span>{{ hasFilters ? 'Modify' : 'Add' }} Filters</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-show="hasFilters"
            v-bind="attrs"
            color="error"
            icon
            small
            v-on="on"
            @click="resetFilters(true)"
          >
            <v-icon> $mdiClose </v-icon>
          </v-btn>
        </template>
        <span>Reset All</span>
      </v-tooltip>
    </v-card-title>

    <v-divider />

    <v-slide-y-transition>
      <v-container v-if="filterMenu" class="grey darken-3" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" class="grey--text text--lighten-2 text-center title">
            Available Filters
          </v-col>
          <v-col lg="10">
            <v-row>
              <v-col cols="6" sm="4" md="3">
                <v-autocomplete
                  v-model="filters.status"
                  :items="metaData.global.states"
                  dense
                  hide-details
                  item-text="value"
                  item-color="secondary"
                  label="Lead Status"
                  multiple
                  solo
                >
                  <template #selection="data">
                    <v-chip v-if="data.index === 0" small>
                      {{ data.item.value }}
                    </v-chip>
                    <span
                      v-else-if="data.index === 1"
                      class="grey--text caption mr-1"
                    >
                      +{{ filters.status.length - 1 }} more
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="6" sm="4" md="3">
                <v-autocomplete
                  v-model="filters.leadPage"
                  :items="pages"
                  deletable-chips
                  dense
                  hide-details
                  item-color="secondary"
                  label="Lead Page"
                  small-chips
                  solo
                />
              </v-col>

              <v-col cols="6" sm="4" md="3">
                <v-autocomplete
                  v-model="filters.campaign"
                  :items="campaigns"
                  deletable-chips
                  dense
                  hide-details
                  item-color="secondary"
                  label="Campaign"
                  small-chips
                  solo
                />
              </v-col>

              <v-col v-if="campaignSlots.length" cols="6" sm="4" md="3">
                <v-autocomplete
                  v-model="filters.timeSlot"
                  :items="campaignSlots"
                  item-text="label"
                  deletable-chips
                  dense
                  hide-details
                  item-color="secondary"
                  label="Time Slots"
                  small-chips
                  solo
                />
              </v-col>

              <v-col cols="6" sm="4" md="3">
                <v-autocomplete
                  v-model="filters.source"
                  :items="sources"
                  deletable-chips
                  dense
                  hide-details
                  item-color="secondary"
                  label="Source"
                  small-chips
                  solo
                />
              </v-col>

              <v-col cols="6" sm="4" md="3">
                <v-autocomplete
                  v-model="filters.tag"
                  :items="tags"
                  deletable-chips
                  dense
                  hide-details
                  item-color="secondary"
                  label="User tags"
                  small-chips
                  solo
                />
              </v-col>

              <v-col cols="6" sm="4" md="3">
                <v-row no-gutters>
                  <v-col cols="8">
                    <v-select
                      v-model="filters.age.comparator"
                      :items="comparators"
                      dense
                      hide-details
                      item-color="secondary"
                      label="Filter"
                      solo
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model="filters.age.value"
                      deletable-chips
                      dense
                      hide-details
                      item-color="secondary"
                      label="Age"
                      solo
                    />
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" class="text-center">
                <v-btn
                  class="ma-2"
                  color="secondary"
                  large
                  text
                  @click="resetFilters"
                >
                  Reset Filters
                </v-btn>
                <v-btn
                  class="ma-2"
                  color="secondary"
                  large
                  @click="applyFilters"
                >
                  Apply Filters
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-slide-y-transition>

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
          <v-row
            v-if="item.batches"
            align="center"
            justify="center"
            no-gutters
            class="font-weight-bold mb-4"
          >
            <span class="mr-2">Batch:</span>
            <v-chip
              v-for="batch in item.batches"
              :key="batch"
              class="mx-1"
              color="white"
              label
              outlined
              small
            >
              {{ batch }}
            </v-chip>
          </v-row>

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
      <template v-if="selected.length" #header>
        <thead>
          <tr>
            <th :colspan="headers.length + 2" class="py-3">
              <v-btn color="primary" rounded small @click="doSomething">
                Do Something
              </v-btn>
            </th>
          </tr>
        </thead>
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
      <template #[`item.source`]="{ item }">
        <div style="white-space: pre-line" v-text="item.source" />
      </template>
      <template #[`item.leadInfo`]="{ item }">
        <nuxt-link
          :to="item.leadInfo.parent.to"
          no-prefetch
          class="secondary--text"
          @click.stop=""
        >
          {{ item.leadInfo.parent.value }}
        </nuxt-link>
        <span v-if="!item.hasLaptop" class="ml-2">
          <v-icon small> $mdiLaptop </v-icon>
          <v-icon color="error" small> $mdiClose </v-icon>
        </span>
        <br />
        {{ item.leadInfo.kid }}
        <v-chip
          v-if="item.timeSlot && item.timeSlot.label"
          class="ml-2 font-weight-bold"
          color="white"
          label
          outlined
          x-small
        >
          {{ item.timeSlot.label }}
        </v-chip>
      </template>
      <template #[`item.contactInfo`]="{ item }">
        <a
          :href="item.contactInfo.phone.href"
          class="secondary--text"
          @click.stop=""
        >
          {{ item.contactInfo.phone.value }}
        </a>
        <small> ({{ item.contactInfo.phone.suffix }}) </small>
        <br />
        <a
          :href="item.contactInfo.email.href"
          class="secondary--text"
          @click.stop=""
        >
          {{ item.contactInfo.email.value }}
        </a>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> $mdiPencil </v-icon>
        <v-icon small @click="deleteItem(item)"> $mdiDelete </v-icon>
        <v-icon
          v-if="showCertificateBtn(item)"
          small
          @click="generateCertificate(item)"
        >
          $mdiFileCog
        </v-icon>
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
    <v-dialog v-model="leadDialog" max-width="600px" persistent>
      <v-card color="grey darken-3">
        <v-card-title>
          <span class="headline">Add Lead Details</span>
        </v-card-title>

        <v-form ref="form" lazy-validation @submit.prevent="addLead">
          <v-card-text>
            <v-text-field
              v-model="leadForm.parentsName"
              :rules="[requiredRules('Parent Name')]"
              dense
              label="Parent's Name *"
              outlined
              required
              validate-on-blur
            />
            <v-text-field
              v-model="leadForm.parentsEmail"
              :rules="[requiredRules('Parent Email Id')]"
              dense
              label="Parent's Email ID *"
              outlined
              type="email"
              required
              validate-on-blur
            />
            <MobilePhoneField
              v-model="leadForm.phone"
              :default-country-code="{
                name: 'India',
                dialCode: '+91',
              }"
              dense
              outlined
            />
            <v-text-field
              v-model="leadForm.kidsName"
              :rules="[requiredRules('kids\'s Name')]"
              dense
              label="Kid's Name *"
              outlined
              required
              validate-on-blur
            />

            <v-text-field
              ref="kidsAge"
              v-model="leadForm.kidsAge"
              :rules="[requiredRules('Kid\'s Age')]"
              :error-messages="ageErrors"
              dense
              label="Kid's Age *"
              suffix="years"
              outlined
              required
              validate-on-blur
              @input="sanitizeKidsAge"
            />
          </v-card-text>
          <v-alert
            v-model="leadForm.alert.show"
            :type="leadForm.alert.type"
            prominent
            dismissible
          >
            {{
              leadForm.alert.type === 'success'
                ? leadForm.alert.message.success
                : leadForm.alert.message.failure
            }}
          </v-alert>

          <v-card-actions class="pt-0 px-6 pb-5">
            <v-spacer />
            <v-btn color="secondary" text @click="cancelLead">Cancel</v-btn>
            <v-btn
              :disabled="leadForm.loading"
              :loading="leadForm.loading"
              color="secondary"
              type="submit"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <div class="hidden-sm-and-up">
      <RequestItem
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
      filterMenu: false,
      leadDialog: false,
      filters: {
        status: null,
        source: null,
        campaign: null,
        campaignSlot: null,
        leadPage: null,
        tag: null,
        age: {
          value: null,
          comparator: null,
        },
      },
      comparators: [
        { text: 'Equal to', value: 'eq' },
        { text: 'Less than', value: 'lt' },
        { text: 'Less than equal to', value: 'lteq' },
        { text: 'Greater than', value: 'gt' },
        { text: 'Greater than equal to', value: 'gteq' },
      ],
      leadForm: {
        loading: false,
        parentsName: null,
        parentsEmail: null,
        phone: {
          country: null,
          number: null,
        },
        kidsName: null,
        kidsAge: null,
        alert: {
          show: false,
          type: 'success',
          errors: {
            age: `Invalid age entered.`,
            default: `Oops! Failed to submit the request.`,
          },
          message: {
            success: `Request was submitted successfully.`,
            failure: `Oops! Failed to submit the request.`,
          },
        },
      },
      ageErrors: [],
      requiredRules: (type) => {
        return (v) => !!v || `${type} can't be empty.`
      },
      defaultHeaders: [
        { text: '#', sortable: false, value: 'index' },
        { text: `Status`, sortable: false, value: 'status' },
        { text: `Created`, value: 'createdAt', width: 102 },
        { text: `Updated`, value: 'updatedAt', width: 102 },
        { text: `Lead Source`, sortable: false, value: 'source' },
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
      hasFilters: false,
      searchDebounceTimer: null,
    }
  },
  computed: {
    ...mapGetters('admin', ['demoRequests', 'metaData']),
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
      return Math.ceil(this.demoRequests.length / this.numItemsPerPage)
    },
    pages() {
      const pages = []
      if (this.metaData) {
        pages.push(...this.metaData.leads.pages)
      }

      return pages
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
    campaignSlots() {
      const campaignSlots = []
      if (this.filters.campaign && this.metaData) {
        const slotsObj = this.metaData.leads.campaignSlots
        if (slotsObj && slotsObj[this.filters.campaign]) {
          campaignSlots.push(...slotsObj[this.filters.campaign])
        }
      }

      return campaignSlots
    },
    tags() {
      const tags = []
      if (this.metaData) {
        tags.push(...this.metaData.global.tags)
      }

      return tags
    },
    requests() {
      const query = { ...this.$route.query }
      const page = query.page ? parseInt(query.page) : 1
      delete query.page

      const resolvedUrl = this.$router.resolve({
        path: '/admin/demo-requests',
        query: this.getSortedQuery(query),
      })

      console.log(`request url in computed: ${resolvedUrl.href}`)

      const requests = this.demoRequests(resolvedUrl.href, page)

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
          path: '/admin/demo-requests',
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

          this.filters.status = query.status ? query.status.split(',') : null
          this.filters.source = query.source
          this.filters.campaign = query.campaign
          this.filters.tag = query.tag
          this.filters.timeSlot = query.time_slot
          this.filters.leadPage = query.lead_page
          if (query.age) {
            const ageParts = query.age.split(',')
            this.filters.age.comparator = ageParts[0]
            this.filters.age.value = ageParts[1]
          }
          this.search = query.search
          if (
            query.status ||
            query.source ||
            query.campaign ||
            query.tag ||
            query.lead_page ||
            query.time_slot ||
            query.age
          ) {
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
        this.resetFilters(true)
        // if (this.options.page !== 1) {
        //   console.log(`watching route params: trying to set the page to 1: `)
        //   this.options.page = 1
        // } else {
        //   console.log(`watching route params: trying to set the query count: `)
        //   this.$router.push({
        //     path: '/admin/demo-requests',
        //     query: { count: this.options.itemsPerPage },
        //   })
        // }

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
          path: '/admin/demo-requests',
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

    if (this.$route.query.status) {
      this.filters.status = this.$route.query.status.split(',')
    }

    if (this.$route.query.source) {
      this.filters.source = this.$route.query.source
    }

    if (this.$route.query.campaign) {
      this.filters.campaign = this.$route.query.campaign
    }

    if (this.$route.query.tag) {
      this.filters.tag = this.$route.query.tag
    }

    if (this.$route.query.time_slot) {
      this.filters.timeSlot = this.$route.query.time_slot
    }

    if (this.$route.query.lead_page) {
      this.filters.leadPage = this.$route.query.lead_page
    }

    if (this.$route.query.age) {
      const ageParts = this.$route.query.age.split(',')
      this.filters.age.comparator = ageParts[0]
      this.filters.age.value = ageParts[1]
    }

    if (this.$route.query.page) {
      this.options.page = parseInt(this.$route.query.page)
    }
  },
  methods: {
    ...mapActions('admin', [
      'getDemoRequests',
      'deleteCustomerEntry',
      'addLeadFromBackend',
    ]),
    showCertificateBtn(item) {
      return item.timeSlot || item.workshopName
    },
    async addLead() {
      console.log('Add lead method called')
      this.leadForm.alert.show = false

      if (this.$refs.form.validate()) {
        let error
        if (this.leadForm.kidsAge < 5 || this.leadForm.kidsAge > 15) {
          error = this.leadForm.alert.errors.age
        }

        const data = {
          page: 'backend',
          parentsName: this.leadForm.parentsName.trim(),
          parentsEmail: this.leadForm.parentsEmail.trim(),
          parentsPhone: this.leadForm.phone.number.trim(),
          country: {
            name: this.leadForm.phone.country.name,
            dialCode: this.leadForm.phone.country.calling_code,
          },
          kidsName: this.leadForm.kidsName.trim(),
          kidsAge: this.leadForm.kidsAge.trim(),
          query: {},
          hasLaptop: true,
          status: 'fresh',
          logCount: 0,
        }

        if (error) {
          this.leadForm.alert.type = 'error'
          this.leadForm.alert.message.failure = error
          this.leadForm.alert.show = true
          return
        }

        try {
          this.leadForm.loading = true
          await this.addLeadFromBackend(data)

          this.$refs.kidsAge.blur()
          this.$refs.form.reset()
          this.leadForm.alert.type = 'success'
          this.leadForm.alert.show = true

          setTimeout(() => {
            this.cancelLead()
          }, 3000)
        } catch (error) {
          this.leadForm.alert.type = 'error'
          this.leadForm.alert.show = true
          this.leadForm.alert.message.failure =
            this.leadForm.alert.errors.default
        }

        this.leadForm.loading = false
      }
    },
    cancelLead() {
      console.info('Cancel lead method called')

      this.leadDialog = false
      this.leadForm.alert.error = null
      this.leadForm.alert.show = false
      this.$refs.form.reset()
    },
    sanitizeKidsAge(value) {
      if (value) {
        const sanitizedValue = value.replace(/\D/g, '')
        if (sanitizedValue !== value) {
          this.ageErrors = ['Only numbers are allowed for this field']
          this.$nextTick(() => {
            this.leadForm.kidsAge = sanitizedValue
          })

          setTimeout(() => {
            this.ageErrors = []
          }, 2000)
        } else {
          const removeLeadingZeroes = value.replace(/^0/g, '')
          this.$nextTick(() => {
            this.leadForm.kidsAge = removeLeadingZeroes
          })

          this.ageErrors = []
        }
      }
    },
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
    generateCertificate(item) {
      console.log('item is: ', item)
      if (item) {
        const routeData = this.$router.resolve(
          `/documents/certificate/${item.id}`
        )
        window.open(routeData.href, '_blank')
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

      if (this.filters.tag) {
        query.tag = this.filters.tag
        hasFilters = true
      }

      if (this.filters.timeSlot) {
        query.time_slot = this.filters.timeSlot
        hasFilters = true
      }

      if (this.filters.leadPage) {
        query.lead_page = this.filters.leadPage
        hasFilters = true
      }

      if (this.filters.age.value) {
        query.age = `${this.filters.age.comparator || 'eq'},${
          this.filters.age.value
        }`
        hasFilters = true
      }

      this.hasFilters = hasFilters
      console.log('setting hasFilters to: ', hasFilters)
    },
    applyFilters() {
      console.log('inside apply filters')
      if (this.options.page === 1) {
        const query = {
          count: this.$route.query.count,
          search: this.$route.query.search,
        }

        this.handleFilters(query)

        this.$router.push({
          path: '/admin/demo-requests',
          query: { ...this.getSortedQuery(query) },
        })
      } else {
        console.log(
          `applyfilters: on page ${this.options.page} so force changing the page to 1`
        )

        this.options.page = 1
      }

      this.filterMenu = false
    },
    resetFilters(resetSearch) {
      this.filters.status = null
      this.filters.source = null
      this.filters.campaign = null
      this.filters.tag = null
      this.filters.timeSlot = null
      this.filters.leadPage = null
      this.filters.age = { value: null, comparator: null }
      this.hasFilters = false

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
          path: '/admin/demo-requests',
          query: { ...this.getSortedQuery(query) },
        })
      } else {
        console.log('changing page to 1 from resetFilters')
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
        tag: query.tag,
        time_slot: query.time_slot,
        lead_page: query.lead_page,
        age: query.age,
      }

      const resolvedUrl = this.$router.resolve({
        path: '/admin/demo-requests',
        query: { ...this.getSortedQuery(options) },
      })

      options.page = query.page ? parseInt(query.page) : 1

      options.route = resolvedUrl.href

      console.log('calling fetch requests: finalOptions: ', options)
      const resetToFirstPage = await this.getDemoRequests(options)
      if (resetToFirstPage) {
        this.options.page = 1
      }

      this.loading = false
    },
    editItem(item) {
      if (item) {
        this.$router.push(`/admin/demo-requests/${item.id}/edit`)
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
            path: '/admin/demo-requests',
            query: this.getSortedQuery(query),
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
