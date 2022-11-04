<template>
  <MarketingContainer>
    <v-card-text v-if="$route.query.reference" class="congrats-container">
      <img src="~/assets/images/welcome.svg" height="176" class="mt-4" />
      <div class="congrats-text">
        <strong>Congratulations!</strong> Your registration is successful.
      </div>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6" class="booking-description">
          We've sent a welcome, and a payment receipt email to you as an
          acknowledgement.
          <small>
            (It may land up in your promotions or spam folders, we request that
            you move it to your primary inbox.)
          </small>
          <br /><br />
          Your registration reference id is
          <strong>{{ $route.query.reference }}</strong>
          <br /><br />
          We'll share the workshop joining details on your registered email
          address 24 hrs prior to the event.
          <br /><br />
          You can always reach out to us at
          <a href="mailto:support@jrinlab.com" class="primary--text">
            support@jrinlab.com
          </a>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-else class="congrats-container">
      <img src="~/assets/images/warning.svg" height="176" class="mt-4" />
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6" class="booking-description">
          Uh Oh! There seems to be some issue with your registration.
          <br />
          <br />
          We request that you reach out to us at
          <a href="mailto:support@jrinlab.com" class="primary--text">
            support@jrinlab.com
          </a>
          with your registrations details (Your name, email address and phone
          number etc.).
        </v-col>
      </v-row>
    </v-card-text>
  </MarketingContainer>
</template>

<script>
export default {
  layout: 'marketing',
  head() {
    return {
      title: 'Payment processed successfully',
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex,nofollow',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.congrats-container {
  text-align: center;
  padding-top: 36px;
  padding-bottom: 36px;

  .congrats-text {
    font-size: 1.5rem;
    margin-top: 36px;
    margin-bottom: 16px;
    line-height: 2rem;
  }

  .emoji {
    font-size: 1.5rem;
    margin-left: 4px;
    display: inline-block;
    vertical-align: middle;
  }

  .booking-description {
    font-size: 1.2rem;
    line-height: 1.625rem;
  }
}
</style>
