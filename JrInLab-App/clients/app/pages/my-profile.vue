<template>
  <v-card class="transparent" flat>
    <div class="secondary" style="height: 156px" />
    <v-card-text>
      <v-row justify="center" style="margin-top: -72px">
        <v-col cols="12" sm="9">
          <v-card class="text-center">
            <v-avatar
              size="128"
              style="margin-top: -64px; border: 8px solid white"
            >
              <v-img
                :src="require('/assets/images/profile_pic.svg')"
                alt="default profile picture"
              />
            </v-avatar>
            <v-card-text class="text-center">
              <div class="headline font-weight-medium">
                {{ user.name }}
              </div>
              <v-row align="center" class="mt-2" justify="center">
                <v-icon>$mdiEmail</v-icon>
                <span class="title font-weight-regular mx-2">
                  {{ user.email }}
                </span>

                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-icon
                      :color="user.emailVerified ? 'success' : 'warning'"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{
                        user.emailVerified
                          ? '$mdiShieldCheck'
                          : '$mdiShieldAlert'
                      }}
                    </v-icon>
                  </template>

                  <span>
                    {{
                      user.emailVerified
                        ? 'Email verified'
                        : 'Email verification pending'
                    }}
                  </span>
                </v-tooltip>
              </v-row>
              <v-row class="mt-6 text-rem-1" justify="center" no-gutters>
                <div
                  v-if="user.city && user.country"
                  class="d-flex align-center px-3 py-1"
                >
                  <v-icon left>$mdiMapMarker</v-icon>
                  {{ user.city }}, {{ user.country.name }}
                </div>
                <span class="d-flex align-center px-3 py-1">
                  <v-icon left>$mdiRocketLaunch</v-icon>
                  Joined on {{ user.createdAt | dateMonthFilter }}
                </span>
                <span v-if="user.dob" class="d-flex align-center px-3 py-1">
                  <v-icon left>$mdiCake</v-icon>
                  Birthday {{ user.dob | dateMonthFilter }}
                </span>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="9">
          <div class="headline font-weight-medium my-4">Your Projects</div>
          <v-row v-if="loading" class="pa-4" no-gutters>
            <v-progress-circular color="primary" indeterminate />
          </v-row>
          <v-row v-else>
            <template v-if="userProjects && userProjects.length">
              <v-col
                v-for="project in userProjects"
                :key="project.id"
                cols="12"
                sm="6"
              >
                <project-card :project="project" />
              </v-col>
            </template>
            <v-col v-else cols="12" class="grey--text text--darken-2">
              <p>You've not created any project</p>
              <v-btn
                :disabled="creatingProject"
                :loading="creatingProject"
                color="primary"
                @click.stop="createProject"
              >
                <v-icon left> $mdiPlus </v-icon>
                New project
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
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
    this.$store.commit('setPageTitle', 'My Profile')
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
