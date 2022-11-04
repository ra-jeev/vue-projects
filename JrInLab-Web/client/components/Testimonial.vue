<template>
  <div class="pb-10">
    <v-card :class="`bg--${cardColor}`" shaped class="testimonial-card">
      <v-list-item class="pt-2">
        <v-list-item-avatar :size="avatarSize">
          <v-img :src="avatar" :alt="testimonial.author.name" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ testimonial.author.name }}
          </v-list-item-title>
          <v-list-item-subtitle class="testimonial-info">
            {{ testimonial.author.info }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-card-text class="testimonial-text pb-10">
        "{{ testimonial.text }}"
      </v-card-text>

      <span class="testimonial-icon">
        <v-icon size="36" color="primary"> $mdiCommentQuote </v-icon>
      </span>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    testimonial: {
      type: Object,
      required: true,
    },
    cardColor: {
      type: String,
      default: 'white',
    },
  },
  computed: {
    avatar() {
      let avatar = this.testimonial.author.avatar

      if (!avatar) {
        avatar =
          this.testimonial.author.gender === 'male'
            ? require(`~/assets/images/male_avatar.svg`)
            : require(`~/assets/images/female_avatar.svg`)
      }

      return avatar
    },
    avatarSize() {
      return this.$vuetify.breakpoint.mdAndUp ? 72 : 56
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/colors.scss';

.testimonial-card {
  position: relative;

  .testimonial-icon {
    position: absolute;
    background-color: white;
    padding: 16px;
    bottom: -34px;
    left: calc(50% - 34px);
    border-radius: 50% !important;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  }

  .testimonial-info {
    text-overflow: initial;
    white-space: normal;
  }

  .testimonial-text {
    font-size: 1.1rem;
    line-height: 1.5rem;
    font-style: italic;
  }
}
</style>
