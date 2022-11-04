<template>
  <div class="page-container">
    <div class="page-bg">
      <slot name="header-bg">
        <div class="header-bg" />
      </slot>
    </div>

    <div class="header-text">
      <slot name="header" />
    </div>

    <v-container>
      <v-card class="content-card">
        <slot />
      </v-card>
    </v-container>

    <slot name="details" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>

<style lang="scss" scoped>
@import '~/assets/colors.scss';

.header-text {
  position: inherit;
  z-index: 0;
  text-align: center;
}

.header-bg {
  background: url('~assets/images/rocket-pattern.svg'),
    linear-gradient(
      to bottom left,
      rgba(107, 99, 255, 0.3),
      rgba(40, 56, 203, 0.6)
    ),
    #6c63ff;
  height: 500px;
}

.page-container {
  position: relative;
  padding-top: 136px;

  .page-bg {
    position: absolute;
    width: 100%;
    height: 500px;
    top: 0;
  }

  .content-card {
    padding: 0 36px;
    margin-bottom: 36px;
    background-color: #f1f3ff;
    min-height: 400px;
  }
}

.page-container.india-card {
  .content-card {
    background: linear-gradient(
      to bottom,
      #ef6c00 0%,
      #ffffff 50%,
      #28bf2a 100%
    );
  }
}

.page-container.transparent-card {
  background-color: $primary-light;

  .content-card {
    background: #0000;
    box-shadow: none;
    padding: 0;
  }
}

@media only screen and (max-width: 599px) {
  .page-container {
    padding-top: 112px;

    .content-card {
      padding: 0;
    }
  }
}

// background: linear-gradient(
//       to bottom,
//       #ef6c00 0%,
//       #ffffff 50%,
//       #28bf2a 100%
//     );
</style>
