<template>
  <v-app>
    <AppDrawer
      :drawer="drawer"
      :page-links="pageLinks"
      @drawer-close="drawer = false"
    />

    <AppBar
      :page-links="pageLinks"
      app
      elevate-on-scroll
      @drawer-open="drawer = true"
    />

    <!-- <v-snackbar
      v-model="campBanner.visible"
      :timeout="-1"
      color="secondary"
      top
    >
      <v-icon dark left> $mdiAlertDecagram </v-icon>
      <span class="font-weight-medium">
        {{ campBanner.text }}
      </span>

      <nuxt-link
        :to="{ path: campBanner.path, query: $route.query }"
        class="white--text ml-2 font-weight-bold"
      >
        Register now!
      </nuxt-link>

      <template #action="{ attrs }">
        <v-icon v-bind="attrs" dark @click="campBanner.visible = false">
          $mdiClose
        </v-icon>
      </template>
    </v-snackbar> -->

    <v-main>
      <nuxt />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      // campBanner: {
      //   visible: false,
      //   path: '/vedic-maths',
      //   text: 'Vedic Maths Camp',
      // },
      pageLinks: [
        {
          title: 'Home',
          to: '/',
        },
        // {
        //   title: 'Vedic Maths Camp',
        //   to: '/vedic-maths',
        //   hide: true,
        // },
        {
          title: 'About Us',
          to: '/about-us',
        },
        {
          title: 'Gallery',
          to: '/gallery',
          hide: true,
        },
        {
          title: 'FAQs',
          to: '/faqs',
        },
        {
          title: 'For Schools',
          to: '/school-partnerships',
        },
        {
          title: 'Contact Us',
          to: '/contact-us',
        },
      ],
      campCampaignOn: false,
    }
  },
  mounted() {
    this.dark = document.scrollingElement.scrollTop < 88
    // if (localStorage && localStorage.summer_camp === 'sg') {
    //   this.campBanner.path = '/sg-summer-camp'
    //   this.campBanner.text = 'Summer Camp 2021'
    //   this.pageLinks[1].title = 'Summer Camp 2021'
    //   this.pageLinks[1].to = '/sg-summer-camp'
    // }

    // this.pageLinks[1].hide = !this.campCampaignOn
    // this.campBanner.visible = this.campCampaignOn
  },
}
</script>
