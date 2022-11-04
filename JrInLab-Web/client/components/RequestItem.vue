<template>
  <v-card>
    <v-card-title>
      <nuxt-link :to="`/admin/demo-requests/${request.id}`">
        {{ request.parentsName }}
      </nuxt-link>
      <v-spacer />
      <v-chip small>{{ request.status }}</v-chip>
      <v-menu bottom left>
        <template #activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon> $mdiDotsVertical </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="menuOption in menuOptions"
            :key="menuOption.value"
            @click="handleMenuClick(menuOption.value)"
          >
            <v-list-item-title>{{ menuOption.title }}</v-list-item-title>
            <v-list-item-icon>
              <v-icon>{{ menuOption.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-subtitle>
      <v-row no-gutters>
        {{ request.kidsName }}, {{ request.kidsAge }}
        <v-spacer />
        <template v-if="request.updatedAt">
          U:
          {{ request.updatedAt | dateFilter }}
        </template>
        <template v-else>
          C:
          {{ request.createdAt | dateFilter }}
        </template>
      </v-row>
    </v-card-subtitle>
    <v-progress-linear v-if="loading" indeterminate />
    <v-list>
      <v-list-item :href="`tel:${phoneNumber}`">
        <v-list-item-icon>
          <v-icon color="primary"> $mdiPhone </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ phoneNumber }}
          </v-list-item-title>
          <v-list-item-subtitle>Parent's Mobile</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item :href="`mailto:${request.parentsEmail}`">
        <v-list-item-icon>
          <v-icon color="primary"> $mdiEmail </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ request.parentsEmail }}</v-list-item-title>
          <v-list-item-subtitle>Parent's Email</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-card-text :class="{ 'success lighten-1': request.attended }">
      <v-row align="center" no-gutters>
        <utm-info :page="request.page" :query="request.query" />
        <v-spacer />
        <v-btn color="primary" rounded small @click="expanded = !expanded">
          {{ request.logCount || 0 }}
          <v-icon right>
            {{ expanded ? '$mdiChevronUp' : '$mdiChevronDown' }}
          </v-icon>
        </v-btn>
      </v-row>
    </v-card-text>
    <v-expand-transition>
      <div v-show="expanded">
        <v-divider />

        <v-card-text>
          <template v-if="request.logCount && request.logs">
            <div v-for="(log, index) in logs" :key="log.id">
              <v-chip
                v-if="log.status"
                outlined
                small
                label
                color="white"
                class="small-chip"
              >
                {{ log.status.old }} -> {{ log.status.new }}
              </v-chip>
              <span class="ml-2">
                {{ log.summary }}
              </span>
              <div class="text-right mt-1">
                &mdash; {{ log.author.name }}, {{ log.createdAt | dateFilter }}
              </div>
              <v-divider v-if="index !== logs.length - 1" class="my-2" />
            </div>
          </template>
          <div v-else class="text-center">
            No interactions activity
            <br />
            <v-btn
              :to="`/admin/demo-requests/${request.id}`"
              color="primary"
              class="mt-4"
              small
            >
              <v-icon left> $mdiPlus </v-icon>
              Log Interaction
            </v-btn>
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    request: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      default: 'demo',
    },
  },
  data() {
    return {
      expanded: false,
      loading: false,
    }
  },
  computed: {
    logs() {
      const sortLogs = []

      if (this.request.logs) {
        for (const logId in this.request.logs) {
          sortLogs.push({ id: logId, ...this.request.logs[logId] })
        }

        sortLogs.sort((log1, log2) => {
          return log2.createdAt.toMillis() - log1.createdAt.toMillis()
        })
      }

      return sortLogs
    },
    phoneNumber() {
      let completePhone = ''
      if (this.request.country) {
        completePhone += this.request.country.dialCode + '-'
      }

      completePhone += this.request.parentsPhone

      return completePhone
    },
    menuOptions() {
      const options = []

      if (this.type === 'camp') {
        if (this.request.attended) {
          options.push({
            title: 'Mark Absent',
            value: 'attendance',
            icon: '$mdiHand',
          })
          options.push({
            title: 'Get Certificate',
            value: 'certificate',
            icon: '$mdiOpenInNew',
          })
        } else {
          options.push({ title: 'Mark Present', value: 'attendance' })
        }
      }

      return options
    },
  },
  methods: {
    ...mapActions('admin', ['markAttendance']),
    async handleMenuClick(type) {
      if (type === 'attendance') {
        this.loading = true
        await this.markAttendance({
          id: this.request.id,
          attended: !this.request.attended,
        })
        this.loading = false
      } else if (type === 'certificate') {
        const routeData = this.$router.resolve(
          `/documents/certificate/${this.request.id}`
        )
        window.open(routeData.href, '_blank')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.small-chip {
  padding: 0 6px;
}

.attended {
  border-top: 4px solid greenyellow;
}
</style>
