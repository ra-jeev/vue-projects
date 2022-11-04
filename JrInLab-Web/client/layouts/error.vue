<template>
  <div
    class="
      d-flex
      flex-column
      justify-space-around
      align-center
      bg--lighter
      fill-height
    "
  >
    <Logo height="64" />

    <div class="img-container">
      <v-img
        :src="
          error.statusCode === 404
            ? require('~/assets/images/not_found.svg')
            : require('~/assets/images/warning.svg')
        "
        width="100%"
        max-height="272"
        contain
      />
    </div>

    <div class="error-details">
      <h1>
        {{ error.statusCode === 404 ? pageNotFound : otherError }}
      </h1>
      <NuxtLink to="/"> Return to Home Page </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound:
        "Uh Oh! We looked everywhere, but couldn't find the requested page.",
      otherError:
        "Uh oh! This shouldn't have happened, but we've encountered an error.",
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style lang="scss" scoped>
.img-container {
  max-width: 100%;
  padding: 16px 24px;
}

.error-details {
  text-align: center;
  padding: 16px;

  h1 {
    font-size: 2rem;
    line-height: 2.5rem;
    margin-bottom: 16px;
  }

  a {
    font-size: 1.5rem;
    font-weight: 500;
  }
}

@media only screen and (min-width: 1264px) {
  .error-details {
    max-width: 50%;
  }
}

@media only screen and (max-width: 1263px) {
  .error-details {
    max-width: 67%;
  }
}

@media only screen and (max-width: 599px) {
  .error-details {
    max-width: 100%;

    h1 {
      font-size: 1.25rem;
      line-height: 1.5rem;
    }

    a {
      font-size: 1rem;
    }
  }
}
</style>
