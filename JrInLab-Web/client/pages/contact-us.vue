<template>
  <div>
    <section
      v-for="section in sections"
      :key="`section_${section.name}`"
      :class="`bg--${section.background}`"
      class="section"
    >
      <v-container>
        <HeroSection
          v-if="section.type === 'hero'"
          :image="section.image"
          :title="section.title"
          :description="section.description"
        />
        <template v-if="section.type === 'form'">
          <h2 class="section__header text-center">
            {{ section.title }}
          </h2>
          <v-row justify="center" class="mt-12">
            <v-col cols="12" sm="10" md="8" lg="6">
              <ContactForm />
            </v-col>
          </v-row>
        </template>
        <ContactsSection
          v-if="section.type === 'contacts'"
          :header="section.title"
          :contacts="section.contacts"
        />
        <template v-if="section.type === 'offices'">
          <h2 class="section__header text-center">
            {{ section.title }}
          </h2>
          <v-row justify="center" class="mt-8">
            <v-col
              v-for="office in section.offices"
              :key="`office_${office.name}`"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card>
                <v-card-title>{{ office.name }}</v-card-title>
                <v-card-text
                  class="address-text"
                  v-html="$md.render(office.address)"
                />
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </section>
  </div>
</template>

<script>
import Contact from '@/assets/data/contact'
import sectionSanitizer from '@/mixins/sectionSanitizer'

export default {
  mixins: [sectionSanitizer],
  data() {
    return {
      sections: Contact.sections,
      title: 'Our Contact Information',
      description:
        'Information about the different ways you can reach out to us. You can drop us a quick message, or write to us at hello@jrinlab.com',
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.title,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.description,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://www.jrinlab.com/contact-us',
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.description,
        },
      ],
    }
  },
  mounted() {
    this.sanitizeSections()
    if (this.$route.params && this.$route.params.scrollTarget) {
      this.$vuetify.goTo(this.$route.params.scrollTarget)
    }
  },
}
</script>

<style lang="scss" scoped>
.address-text {
  font-size: 1rem;

  ::v-deep p:last-child {
    margin-bottom: 0;
  }
}
</style>
