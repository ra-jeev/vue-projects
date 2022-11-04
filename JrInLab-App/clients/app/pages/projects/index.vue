<template>
  <v-container>
    <v-row justify="center">
      <v-progress-linear v-show="loading" color="primary" indeterminate />
      <v-col cols="12" sm="10" md="8" lg="7">
        <template v-if="userProjects && userProjects.length">
          <div class="d-flex align-center mt-4">
            <div class="font-weight-medium headline">
              All Projects ({{ userProjects ? userProjects.length : 0 }})
            </div>
            <v-spacer />
            <v-btn color="primary" small @click.stop="createProject">
              <v-icon left>$mdiPlus</v-icon>
              New project
            </v-btn>
          </div>
          <project-card
            v-for="project in userProjects"
            :key="project.id"
            :project="project"
            class="mt-4"
          />
        </template>

        <div v-else-if="!loading" class="text-center mt-12">
          <div class="headline grey--text text--darken-2">
            You haven't created any project
          </div>

          <img
            src="~/assets/images/building_blocks.svg"
            alt="Depiction of build your project"
            class="mt-12"
            height="244"
          />
          <div class="mt-12">
            <p class="grey--text text--darken-2">
              Create a new project by clicking the button below
            </p>
            <v-btn color="primary" large @click.stop="createProject">
              <v-icon left> $mdiPlus </v-icon>
              New project
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ProjectsPage',
  data() {
    return {
      loading: false,
      creatingProject: false,
    }
  },
  computed: {
    ...mapGetters(['user', 'userProjects']),
  },
  beforeMount() {
    this.$store.commit('setPageTitle', 'My Projects')
    this.getProjects()
  },
  methods: {
    ...mapActions(['getUserProjects', 'createUserProject']),
    async getProjects() {
      this.loading = true
      await this.getUserProjects()
      this.loading = false
    },
    async createProject() {
      this.creatingProject = true
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

      this.creatingProject = false
    },
  },
}
</script>
