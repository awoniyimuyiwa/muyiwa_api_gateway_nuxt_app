<template>
  <div>
    <TheNavBar />
    <section class="main-content">
      <nuxt />
    </section>
  </div>
</template>

<script>
import TheNavBar from "@/components/global/TheNavBar";

export default {
  components: {
    TheNavBar
  },

  head () {
    return this.$nuxtI18nSeo();
  }
};
</script>

<style>
  .page-wrap {
    min-height: 100%;
  }
</style>
