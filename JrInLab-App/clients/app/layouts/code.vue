<template>
  <v-app>
    <v-navigation-drawer
      :value="drawer"
      temporary
      app
      color="primary"
      dark
      fixed
      @input="onDrawerStateChange"
    >
      <template #prepend>
        <div class="pa-4">
          <v-icon class="mr-4" @click.stop="$store.commit('toggleDrawer')">
            $mdiMenu
          </v-icon>
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

    <v-main class="page-bg">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'CodeLayout',
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
    }
  },
  computed: {
    ...mapGetters(['user', 'drawer']),
  },
  beforeDestroy() {
    console.log('this is the beforeDestroy of the code layout')
    if (this.drawer) {
      // If the drawer is open, toggle it
      this.$store.commit('toggleDrawer')
    }
  },
  methods: {
    ...mapActions(['createUserProject']),
    onDrawerStateChange(val) {
      if (val !== this.drawer) {
        this.$store.commit('toggleDrawer')
      }
    },
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

<style lang="scss" scoped>
html {
  overflow-y: hidden;
}

.page-bg {
  background-color: #ebebeb;
}
</style>
