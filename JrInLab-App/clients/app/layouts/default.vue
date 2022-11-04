<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app color="primary" dark fixed>
      <template #prepend>
        <div class="pa-4">
          <logo dark height="42" />
          <v-btn
            block
            class="primary--text mt-8"
            color="white"
            @click.stop="createProject"
          >
            <v-icon left>$mdiPlus</v-icon>
            New Project
          </v-btn>
        </div>
      </template>
      <v-divider />
      <v-list>
        <v-list-item
          v-for="pageLink in pageLinks"
          :key="pageLink.to"
          :to="pageLink.to"
          nuxt
        >
          <v-list-item-icon>
            <v-icon v-text="pageLink.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="pageLink.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template #append>
        <div class="pa-4">
          <v-btn block color="white" outlined @click.stop="signOut">
            <v-icon left>$mdiExitToApp</v-icon>
            Sign Out
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app elevate-on-scroll fixed>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn v-if="showBack" icon @click.stop="goBack">
        <v-icon>$mdiArrowLeft</v-icon>
      </v-btn>
      <v-toolbar-title class="headline font-weight-bold">
        {{ pageTitle }}
      </v-toolbar-title>
      <v-spacer />

      <template v-if="toolbarButtons">
        <v-btn
          v-for="(button, index) in toolbarButtons"
          :key="button.title"
          :class="{ 'ml-4': index }"
          :disabled="button.loading"
          :loading="button.loading"
          :to="button.to"
          class="hidden-xs-only"
          color="primary"
          @click.stop="button.action ? button.action() : ''"
        >
          <v-icon left>{{ button.icon }}</v-icon>
          {{ button.title }}
        </v-btn>
      </template>
    </v-app-bar>

    <v-main class="page-bg">
      <nuxt />
    </v-main>
    <!-- <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'DefaultLayout',
  data() {
    return {
      pageLinks: [
        {
          to: '/',
          icon: '$mdiWeb',
          title: 'My Websites',
        },
        {
          to: '/projects',
          icon: '$mdiFolderFile',
          title: 'My Projects',
        },
        {
          to: '/my-profile',
          icon: '$mdiAccountCircle',
          title: 'My Profile',
        },
      ],
      drawer: true,
      toolbarButtons: [
        {
          action: this.createProject,
          icon: '$mdiPlus',
          title: 'New Project',
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['user', 'pageTitle', 'showBack']),
  },
  beforeMount() {
    if (this.$vuetify.breakpoint.mdAndDown) {
      this.drawer = false
    }
  },
  methods: {
    ...mapActions(['goBack', 'createUserProject']),
    async signOut() {
      await this.$store.dispatch('signOut')
      this.$router.replace('/sign-in')
    },
    async createProject() {
      // this.loading = true
      const date = new Date()
      const title = `Untitled ${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}-${date.getSeconds()}-${date.getMilliseconds()}`
      try {
        const id = await this.createUserProject({
          title,
          lastUpdatedFile: 'index.html',
          files: [
            {
              name: 'index.html',
              mode: 'htmlmixed',
              data: '',
            },
          ],
        })

        this.$router.push(`/projects/${id}`)
      } catch (error) {
        console.log('failed to create project')
      }
      // this.loading = false
    },
  },
}
</script>

<style lang="scss">
.page-bg {
  background-color: #ebebeb;
}
</style>
