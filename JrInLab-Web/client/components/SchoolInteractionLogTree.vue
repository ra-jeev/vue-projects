<template>
  <div>
    <v-timeline class="hidden-xs-only">
      <v-slide-x-reverse-transition group hide-on-leave>
        <v-timeline-item
          v-for="log in logs"
          :key="log.id"
          :color="log.status ? states[log.status.new].color : 'blue darken-2'"
          :icon="log.status ? states[log.status.new].icon : '$mdiPencil'"
          :small="!log.status"
          fill-dot
        >
          <v-chip slot="opposite" color="white" label outlined>
            {{ log.createdAt | dateFilter }}
          </v-chip>
          <v-card class="grey darken-2">
            <v-card-title
              v-if="log.status"
              :class="states[log.status.new].color"
              class="timeline-title"
            >
              <v-chip color="white" small outlined>
                {{ log.status.old.toUpperCase() }}
              </v-chip>
              <v-icon small class="mx-2"> $mdiArrowRight </v-icon>
              <v-chip color="white" small outlined>
                {{ log.status.new.toUpperCase() }}
              </v-chip>
              <v-spacer />
              <v-btn
                v-if="!logInEdit"
                color="white"
                icon
                small
                outlined
                @click.stop="editLog(log)"
              >
                <v-icon small> $mdiPencil </v-icon>
              </v-btn>
              <v-btn
                v-else-if="logInEdit && logInEdit.id === log.id"
                icon
                small
                class="error"
                @click.stop="cancelEdit"
              >
                <v-icon> $mdiClose </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text
              v-if="!logInEdit || logInEdit.id !== log.id"
              class="timeline-text"
            >
              <div class="summary">
                {{ log.summary }}
              </div>
              <div class="description" v-text="log.description" />

              <v-row
                v-if="log.schedule"
                class="mt-2"
                no-gutters
                justify="space-between"
              >
                <span>Schedule</span>
                <v-chip label outlined small color="white">
                  {{ log.schedule | dateFilter }}
                </v-chip>
              </v-row>
              <div class="author">&mdash; {{ log.author.name }}</div>
            </v-card-text>
            <v-card-text v-else class="pt-4">
              <v-form
                ref="form"
                lazy-validation
                @submit.prevent="submitChanges"
              >
                <v-text-field
                  v-model="logInEdit.summary"
                  :rules="summaryRules"
                  label="Log summary *"
                  outlined
                  required
                  validate-on-blur
                />
                <v-textarea
                  v-model="logInEdit.description"
                  :rules="descriptionRules"
                  label="Log description *"
                  rows="3"
                  outlined
                  required
                  validate-on-blur
                />
                <v-row no-gutters>
                  <v-spacer />
                  <v-btn
                    :color="states[log.status.new].color"
                    :disabled="loading"
                    :loading="loading"
                    type="submit"
                    class="ml-2"
                  >
                    <v-icon left> $mdiCloudUpload </v-icon>
                    Submit
                  </v-btn>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-slide-x-reverse-transition>
    </v-timeline>
    <div class="hidden-sm-and-up pt-4">
      <div class="title mb-4">Customer Interaction Logs</div>

      <div
        v-for="(log, index) in logs"
        :key="log.id"
        :class="{ 'mt-6': index }"
      >
        <v-row align="center" no-gutters>
          <v-avatar
            :class="log.status ? states[log.status.new].color : 'blue darken-2'"
            size="36"
          >
            <v-icon>
              {{ log.status ? states[log.status.new].icon : '$mdiPencil' }}
            </v-icon>
          </v-avatar>
          <v-chip color="white" label outlined small class="ml-3">
            {{ log.createdAt | dateFilter }}
          </v-chip>
        </v-row>
        <v-card class="grey darken-2 mt-2">
          <v-card-title
            v-if="log.status"
            :class="states[log.status.new].color"
            class="timeline-title"
          >
            <v-chip color="white" small outlined>
              {{ log.status.old.toUpperCase() }}
            </v-chip>
            <v-icon small class="mx-2"> $mdiArrowRight </v-icon>
            <v-chip color="white" small outlined>
              {{ log.status.new.toUpperCase() }}
            </v-chip>
          </v-card-title>
          <v-card-text class="timeline-text">
            <div class="summary">
              {{ log.summary }}
            </div>
            <div class="description" v-text="log.description" />

            <v-row
              v-if="log.schedule"
              class="mt-2"
              no-gutters
              justify="space-between"
            >
              <span>Schedule</span>
              <v-chip label outlined small color="white">
                {{ log.schedule | dateFilter }}
              </v-chip>
            </v-row>

            <div class="author">&mdash; {{ log.author.name }}</div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    logs: {
      type: Array,
      required: true,
    },
    states: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      logInEdit: null,
      loading: false,
      summaryRules: [(v) => !!v || `Please add entry's short summary`],
      descriptionRules: [(v) => !!v || `Please describe the entry in detail`],
    }
  },
  methods: {
    ...mapActions('admin', ['editSchoolInteraction']),
    editLog(log) {
      this.logInEdit = {}
      Object.assign(this.logInEdit, log)
      console.log('logInEdit:: ', this.logInEdit)
    },
    cancelEdit() {
      this.logInEdit = null
    },
    async submitChanges() {
      if (this.$refs.form[0].validate()) {
        let hasChanges = false
        const data = {}
        const originalLog = this.logs.find(
          (log) => log.id === this.logInEdit.id
        )

        if (originalLog.summary !== this.logInEdit.summary) {
          data.summary = this.logInEdit.summary
          hasChanges = true
        }

        if (originalLog.description !== this.logInEdit.description) {
          data.description = this.logInEdit.description
          hasChanges = true
        }

        if (hasChanges) {
          this.loading = true
          try {
            await this.editSchoolInteraction({ id: this.logInEdit.id, data })
            this.logInEdit = null
          } catch (error) {
            console.log('failed to edit log:: ', error)
          }

          this.loading = false
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.timeline-title {
  padding: 8px 16px;
}

.timeline-text {
  padding: 12px 16px;
  font-size: 1rem;

  .summary {
    font-weight: 500;
    font-size: 1.125rem;
  }

  .description {
    white-space: pre-line;
    margin: 12px 0 16px;
  }

  .author {
    margin-top: 12px;
    font-size: 0.9rem;
    text-align: right;
  }
}
</style>
