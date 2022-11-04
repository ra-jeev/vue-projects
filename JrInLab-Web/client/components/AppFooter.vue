<template>
  <v-footer class="bg--dark">
    <v-card flat tile dark width="100%" class="transparent">
      <v-card-text>
        <v-row class="justify-space-between">
          <v-col cols="12" sm="auto" align="center">
            <Logo dark height="64" />
          </v-col>
          <v-col cols="12" sm="auto" align="center">
            <v-card flat tile class="bottom-icon-card">
              <div class="icon-header text-sm-right">Stay Connected:</div>

              <v-btn
                v-for="bottomIconLink in bottomIconLinks"
                :key="bottomIconLink.icon"
                :href="bottomIconLink.href"
                :aria-label="bottomIconLink.label"
                target="_blank"
                icon
                large
                rel="noopener"
                class="icon-btn"
              >
                <v-icon size="28">{{ bottomIconLink.icon }}</v-icon>
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-text>
        <v-row justify="space-between">
          <v-col cols="12" sm="auto" order-sm="last" align="center">
            <nuxt-link
              v-for="link in bottomLinks"
              :key="link.to"
              :to="{ path: link.to, query: $route.query }"
              class="bottom-link"
            >
              {{ link.title }}
            </nuxt-link>
          </v-col>
          <v-col cols="12" sm="auto" align="center">
            &copy; {{ new Date().getFullYear() }}, Edulabtech Solutions Pvt.
            Ltd., All Rights Reserved
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      bottomIconLinks: [
        {
          icon: '$mdiYoutube',
          href: 'https://www.youtube.com/channel/UClvwL9pZ3DBxW6X7CTcP96g',
          label: `JrinLab YouTube's Channel`,
        },
        {
          icon: '$mdiFacebook',
          href: 'https://facebook.com/jrinlab',
          label: `JrinLab's Facebook Page`,
        },
        {
          icon: '$mdiEmail',
          href: 'mailto:hello@jrinlab.com',
          label: `JrinLab's Contact Email Address`,
        },
      ],
      bottomLinks: [
        {
          title: 'For Schools',
          to: '/school-partnerships',
        },
        { title: 'FAQs', to: '/faqs' },
        { title: 'Terms & Conditions', to: '/terms' },
        { title: 'Privacy Policy', to: '/privacy' },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.bottom-link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
}

.bottom-link + .bottom-link {
  margin-left: 12px;
}

.bottom-icon-card {
  background-color: rgba(0, 0, 0, 0) !important;

  .icon-header {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 8px;
  }

  .icon-btn {
    .v-icon {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .icon-btn:hover {
    .v-icon {
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .icon-btn + .icon-btn {
    margin-left: 12px;
  }
}
</style>
