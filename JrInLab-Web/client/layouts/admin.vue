<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" app fixed>
      <v-list>
        <v-list-item :class="{ 'px-2': mini }" link>
          <v-list-item-content>
            <Logo dark height="40" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list>
        <v-list-item :class="{ 'px-2': mini }">
          <v-list-item-avatar v-if="mini" color="primary">
            <span class="white--text title">
              {{
                user.displayName
                  ? user.displayName.substring(0, 1).toUpperCase()
                  : user.email.substring(0, 1).toUpperCase()
              }}
            </span>
          </v-list-item-avatar>
          <v-list-item-content v-else>
            <v-list-item-title>
              Hi, {{ user.displayName || user.email }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="pageLink in pageLinks"
          :key="pageLink.to"
          :to="pageLink.to"
          :exact="pageLink.exact"
          :target="pageLink.action ? '_blank' : ''"
          nuxt
        >
          <v-list-item-icon>
            <v-icon v-text="pageLink.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="pageLink.title" />
          </v-list-item-content>
          <v-list-item-action v-if="pageLink.action">
            <v-icon>{{ pageLink.action }}</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <template #append>
        <div class="d-flex justify-end">
          <v-btn
            width="40"
            height="40"
            icon
            class="ma-2 hidden-xs-only"
            @click.stop="toggleDrawerSize"
          >
            <v-icon large>
              {{ mini ? '$mdiChevronRight' : '$mdiChevronLeft' }}
            </v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar fixed app>
      <v-app-bar-nav-icon class="hidden-sm-and-up" @click="drawer = true" />
      <v-toolbar-title>Admin Panel</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      isAdmin: false,
      drawer: null,
      mini:
        localStorage && localStorage.miniDrawer
          ? localStorage.miniDrawer === '1'
          : false,
      unrestrictedLinks: [
        {
          icon: '$mdiExitToApp',
          title: 'Sign out',
          to: '/sign-out',
        },
      ],
      restrictedLinks: [
        {
          icon: '$mdiViewDashboard',
          title: 'Admin Dashboard',
          to: '/admin',
          exact: true,
        },
        {
          icon: '$mdiTableAccount',
          title: 'Demo Requests',
          to: '/admin/demo-requests',
          exact: false,
        },
        {
          icon: '$mdiCastEducation',
          title: 'School Requests',
          to: '/admin/school-requests',
          exact: false,
        },
        {
          icon: '$mdiFileCog',
          title: 'Content Manager',
          to: '/admin/cms/', // need to add the trailing (slash) / else it won't work
          action: '$mdiOpenInNew',
          exact: false,
        },
      ],
      superLinks: [
        {
          icon: '$mdiEmail',
          title: 'Enrolled Customers',
          to: '/admin/customers',
          exact: false,
        },
        {
          icon: '$mdiShieldCheck',
          title: 'Super',
          to: '/admin/super',
          exact: true,
        },
      ],
    }
  },
  head() {
    return {
      title: 'Admin console',
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex',
        },
      ],
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    pageLinks() {
      const links = []
      if (this.user) {
        if (this.user.partner) {
          links.push({
            icon: '$mdiTableAccount',
            title: 'Your Dashboard',
            to: '/admin/your-dashboard',
            exact: false,
          })
        }

        if (this.user.admin) {
          links.push(...this.restrictedLinks)
        }

        if (this.user.accessLevel === 15) {
          links.push(...this.superLinks)
        }
      }

      links.push(...this.unrestrictedLinks)

      return links
    },
  },
  created() {
    this.$vuetify.theme.isDark = true
  },
  destroyed() {
    this.$vuetify.theme.isDark = false
  },
  methods: {
    toggleDrawerSize() {
      localStorage.miniDrawer = this.mini ? '0' : '1'
      this.mini = !this.mini
    },
  },
}
</script>
