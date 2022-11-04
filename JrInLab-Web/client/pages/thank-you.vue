<template>
  <MarketingContainer>
    <v-card-text class="congrats-container">
      <img src="~/assets/images/welcome.svg" height="176" class="mt-4" />
      <div class="congrats-text">
        <strong>Congratulations!</strong> Your registration is successful.
        <span class="emoji">🚀</span>
      </div>
      <v-row justify="center">
        <v-col cols="12" sm="10" lg="8" class="booking-description">
          Your registration reference id is
          <strong>{{ $route.query.reference }}</strong>
          <br /><br />
          We've sent a welcome email to you as an acknowledgement.
          <br />
          <small>
            (It may land up in your promotions or spam folders, please move it
            to your primary inbox)
          </small>
          <br /><br />
          We'll share the workshop joining details on your registered email
          address at least 24 hrs prior to the event.
          <br /><br />
          You can always reach out to us at
          <br />
          <a href="mailto:support@jrinlab.com" class="primary--text">
            support@jrinlab.com
          </a>
          /
          <a href="tel:+91-8527894531" class="primary--text">
            +91-85278 94531
          </a>
          ,
          <a href="tel:+91-8851017640" class="primary--text">
            +91-88510 17640
          </a>
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
      title: 'Thank You | Registration Successful',
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
