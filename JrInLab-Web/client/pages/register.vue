<template>
  <div class="page-bg">
    <v-container>
      <h1 class="register-text mt-4">Book A Free Coding Class</h1>
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card class="pa-6 my-6">
            <RegisterForm
              btn-text="Submit Now"
              class="mt-4"
              form-page="register"
              success-page="/booking-done"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Get a free trial coding class',
      description: `Have doubts? Experience a live online class before going ahead with enrolment. Register your kid for a free trial class today.`,
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
          content: 'https://www.jrinlab.com/register',
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
}
</script>

<style lang="scss" scoped>
@import '~/assets/colors.scss';

.page-bg {
  background-color: $primary-light;
}

.register-text {
  font-size: 2rem;
  text-align: center;
}

@media only screen and (max-width: 599px) {
  .register-text {
    font-size: 1.25rem;
  }
}
</style>
