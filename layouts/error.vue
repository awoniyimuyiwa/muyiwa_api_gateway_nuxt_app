<template>
  <div class="error">
    <div
      class="error-code m-b-10 m-t-20"
      style="color:#900">
      {{ error.statusCode }}
    </div>

    <h3 class="font-bold">
      {{ errorTitle }}
    </h3>

    <div class="error-desc">
      {{ errorDesc }}
      <div>
        <nuxt-link
          to="/"
          class="btn">
          {{ $t("nav.home") }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NuxtError",

  layout: "errorLayout", // optional

  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      appName: process.env.APP_NAME
    };
  },

  computed: {
    errorTitle () {
      if (this.error.statusCode === 403) {
        return `403 ${this.$t("errors.forbidden")}`;
      } else if (this.error.statusCode === 404) {
        return `404 ${this.$t("errors.notFound")}`;
      } else if (this.error.statusCode === 500) {
        return `500 ${this.$t("errors.serverError")}`;
      } else if (this.error.statusCode === 503) {
        return `503 ${this.$t("errors.rightBack")}`;
      } else {
        return this.error.statusCode;
      }
    },

    errorDesc () {
      if (this.error.statusCode === 403) {
        return this.$t("errors.notPermitted");
      } else if (this.error.statusCode === 404) {
        return this.$t("errors.doesntExist");
      } else if (this.error.statusCode === 500) {
        return this.$t("errors.somethingWrong");
      } else if (this.error.statusCode === 503) {
        return this.$t("errors.undergoingMaintenance", { appName: this.appName });
      } else {
        return this.error.message;
      }
    }
  },

  head () {
    return {
      title: this.errorTitle
    };
  }
};
</script>

<style scoped>
    .error {
        margin: 100px auto 20px;
        text-align: center;
    }
    .error-code {
        bottom: 60%;
        color: #2d353c;
        font-size: 96px;
        font-weight:bold;
        line-height: 100px;
    }
    .error-desc {
        font-size: 12px;
        color: #647788;
    }
    .m-b-10 {
        margin-bottom: 10px!important;
    }
    .m-t-20 {
        margin-top: 20px!important;
    }
</style>
