<template>
  <div>
    <v-app-bar app dense fixed>
      <v-app-bar-nav-icon @click.stop="$store.commit('toggleDrawer')" />
      <div class="d-flex flex-grow-1" style="max-width: 300px">
        <v-text-field
          v-model="title"
          dense
          flat
          hide-details
          label="Project name..."
          outlined
          required
          solo
          validate-on-blur
          @blur.stop="onTitleChanged"
        />
      </div>

      <v-btn
        :class="hasChanges ? 'red darken-1' : 'grey darken-1'"
        :disabled="saving"
        :loading="saving"
        class="ml-4 white--text"
        small
        outlined
        @click.stop="handleCodeSaving"
      >
        <template #loader>
          <span class="grey--text text--lighten-2"> Saving... </span>
        </template>

        <v-icon left>$mdiContentSave</v-icon>
        Save
      </v-btn>
    </v-app-bar>
    <v-container fill-height fluid>
      <v-row class="fill-height" no-gutters>
        <v-col cols="12" sm="6">
          <codemirror
            v-model="code"
            :options="cmOptions"
            @input="onCodeChange"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <iframe ref="preview" class="preview" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { codemirror } from 'vue-codemirror'

// require styles
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/fold/foldgutter.css'

import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/selection/active-line.js'

import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/xml-fold.js'
import 'codemirror/addon/fold/indent-fold.js'
// autoCloseTags
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/matchtags.js'
import 'codemirror/addon/edit/matchbrackets.js'

import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/xml-hint.js'
import 'codemirror/addon/hint/html-hint.js'

export default {
  name: 'ProjectEditorPage',
  components: { codemirror },
  layout: 'code',
  data() {
    return {
      loading: false,
      code: null,
      cmOptions: {
        autofocus: true,
        tabSize: 4,
        styleActiveLine: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        extraKeys: {
          'Ctrl-Space': 'autocomplete',
          'Ctrl-J': 'toMatchingTag',
        },
        matchTags: { bothTags: true },
        matchBrackets: true,
        mode: 'htmlmixed',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        line: true,
        scrollbarStyle: 'overlay',
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      },
      delayTimer: null,
      PREVIEW_UPDATE_DELAY: 300,
      preview: null,
      title: null,
      autoSaveTimer: null,
      AUTO_SAVE_TIME: 30 * 1000, // 30 secs
      calledOpenSocket: false,
      saving: false,
      hasChanges: false,
    }
  },
  computed: {
    ...mapGetters(['saveCode', 'projectById', 'remoteSaveWorking']),
    project() {
      return this.projectById(this.$route.params.id)
    },
  },
  watch: {
    saveCode(newVal) {
      console.log(`inside saveCode watch inside the component: ${newVal}`)
      if (newVal) {
        this.handleCodeSaving()
        this.$store.commit('saveCode', false)
      }
    },
    remoteSaveWorking(newVal) {
      console.log(`remoteSaveWorking in watch: ${newVal}`)
      if (newVal) {
        this.autoSaveTimer = setInterval(
          this.handleCodeSaving,
          this.AUTO_SAVE_TIME
        )
      } else {
        this.calledOpenSocket = false
        if (this.autoSaveTimer) {
          clearInterval(this.autoSaveTimer)
          this.autoSaveTimer = null
        }
      }
    },
  },
  async beforeMount() {
    await this.getProject()
  },
  beforeDestroy() {
    this.closeWebSocket()
    if (this.delayTimer) {
      clearTimeout(this.delayTimer)
      this.delayTimer = null
    }

    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer)
      this.autoSaveTimer = null
    }
  },
  methods: {
    ...mapActions([
      'saveUserCode',
      'getUserProjectById',
      'openWebSocket',
      'closeWebSocket',
    ]),
    onTitleChanged() {
      console.log(`inside onTitleChanged: ${this.title}`)
      if (this.title) {
        this.hasChanges = true
        if (!this.calledOpenSocket) {
          this.openWebSocket()
          this.calledOpenSocket = true
        }
      } else {
        this.$nextTick(() => {
          this.title = this.project.title
        })
      }
    },
    saveBtnClicked() {
      console.log('manual save clicked')
      if (this.autoSaveTimer) {
        clearInterval(this.autoSaveTimer)
        this.autoSaveTimer = null
      }

      this.handleCodeSaving()
      if (this.remoteSaveWorking) {
        this.autoSaveTimer = setInterval(
          this.handleCodeSaving,
          this.AUTO_SAVE_TIME
        )
      }
    },
    getChanges() {
      const changes = {}
      if (this.title !== this.project.title) {
        changes.title = this.title
      }

      if (this.code !== this.project.projectFiles[0].data) {
        if (this.project.projectFiles[0].data && !this.code) {
          const confirm = window.confirm('Delete everything?')
          if (!confirm) {
            this.code = this.project.projectFiles[0].data
            return changes
          }
        }

        changes.files = {
          name: 'index.html',
          data: this.code,
        }
      }

      return changes
    },
    handleCodeSaving() {
      console.log('entered handleCodeSaving')
      const changes = this.getChanges()
      if (Object.keys(changes).length) {
        this.saving = true
        console.log('Saving the code')
        changes.id = this.$route.params.id
        this.saveUserCode(changes)

        setTimeout(() => {
          this.hasChanges = false
          this.saving = false
        }, 500)
      } else {
        console.log('no changes found so skipping save')
      }
    },
    async getProject() {
      this.loading = true
      try {
        await this.getUserProjectById(this.$route.params.id)
        this.title = this.project.title
        this.code = this.project.projectFiles[0].data
      } catch (error) {
        console.log('failed to fetch project: ', error)
      }
      this.loading = false
    },
    updatePreview(code) {
      let preview = this.preview
      if (!preview) {
        const previewFrame = this.$refs.preview
        this.preview = preview =
          previewFrame.contentDocument || previewFrame.contentWindow.document
      }

      preview.open()
      preview.write(code)
      preview.close()
    },
    onCodeChange(code) {
      clearTimeout(this.delayTimer)
      this.delayTimer = setTimeout(() => {
        this.updatePreview(code)
      }, this.PREVIEW_UPDATE_DELAY)

      this.hasChanges = this.project.projectFiles[0].data !== this.code
      if (!this.calledOpenSocket) {
        this.openWebSocket()
        this.calledOpenSocket = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .vue-codemirror {
  height: calc(100vh - 48px - 24px);
}

::v-deep .CodeMirror {
  height: calc(100vh - 48px - 24px);
}

.preview {
  border: 1px solid #cacaca;
  background-color: white;
  width: 100%;
  height: 100%;
}

@media only screen and (max-width: 599px) {
  ::v-deep .vue-codemirror {
    height: calc(50vh - 24px - 12px);
  }

  ::v-deep .CodeMirror {
    height: calc(50vh - 24px - 12px);
  }

  .preview {
    height: calc(50vh - 24px - 12px);
  }
}
</style>
