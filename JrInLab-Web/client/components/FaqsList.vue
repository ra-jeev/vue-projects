<template>
  <v-expansion-panels hover mandatory multiple>
    <v-expansion-panel
      v-for="(faq, index) in faqs"
      :key="`faq_${index}`"
      class="faq"
      active-class="faq--active"
    >
      <v-expansion-panel-header :class="`bg--${headerBg}`" class="question">
        <template #actions>
          <v-icon size="28" v-text="'$mdiChevronDownCircleOutline'" />
        </template>
        <template #default>
          <div class="d-flex align-center mr-2">
            <v-icon size="28" left v-text="'$mdiHelpRhombus'" />

            {{ faq.question }}
          </div>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="answer">
        <div v-html="$md.render(faq.answer)" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: {
    faqs: {
      type: Array,
      required: true,
    },
    sectionBgColor: {
      type: String,
      default: 'white',
    },
  },
  computed: {
    headerBg() {
      return this.sectionBgColor === 'white' ? 'lighter' : 'white'
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/colors.scss';

.faq {
  .question {
    font-size: 1.25rem;
    line-height: 1.75;
    font-weight: 500;
  }

  .answer {
    padding-top: 16px;

    ::v-deep p:last-child {
      margin-bottom: 0;
    }
  }
}

.faq + .faq {
  margin-top: 16px;
}

.faq--active {
  .question,
  .v-icon {
    color: $primary !important;
  }
}

@media only screen and (max-width: 599px) {
  ::v-deep .v-expansion-panel--active > .v-expansion-panel-header {
    min-height: 52px;
  }

  .faq {
    .question {
      font-size: 1rem;
      line-height: 1.375;
      padding: 12px 16px;
    }

    .answer {
      padding: 12px 16px;

      ::v-deep .v-expansion-panel-content__wrap {
        padding: 0;
      }
    }
  }
}
</style>
