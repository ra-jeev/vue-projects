<template>
  <div>
    <h2 class="section__header text-center" v-html="title" />
    <v-row class="mt-12">
      <v-col
        v-for="(infoItem, index) in infoItems"
        :key="`info_card_${index}`"
        :offset-sm="index % 2 ? 4 : 0"
        :offset-lg="index % 2 ? 5 : 0"
        sm="8"
        lg="7"
        cols="12"
      >
        <v-card outlined class="info-card d-sm-flex">
          <v-img
            :src="infoItem.image.src"
            :alt="infoItem.image.alt"
            :width="infoItem.image.width"
            contain
          />

          <div class="info-card-texts">
            <div class="info-title">{{ infoItem.title }}</div>
            <div
              class="info-description markdown-text"
              v-html="$md.render(infoItem.description)"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-12" no-gutters>
      <CtaBtn
        v-if="cta"
        :btn-text="cta.text"
        :color="cta.color"
        :to="cta.action"
        make-extra-long
        x-large
      />
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    infoItems: {
      type: Array,
      required: true,
    },
    cta: {
      type: Object,
      default: undefined,
    },
  },
}
</script>

<style lang="scss" scoped>
.info-card {
  padding: 16px;
  border-radius: 12px !important;

  .info-card-texts {
    padding-left: 16px;

    .info-title {
      font-size: 1.25rem;
      font-weight: 500;
    }

    .info-description {
      margin-top: 8px;
      font-size: 1rem;
      line-height: 1.375rem;
    }
  }
}

@media only screen and (max-width: 599px) {
  .info-card {
    .info-card-texts {
      padding-left: 0;
      padding-top: 12px;
    }
  }
}
</style>
