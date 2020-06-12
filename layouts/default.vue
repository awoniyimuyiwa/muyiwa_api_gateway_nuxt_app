<template>
  <div>
    <TheNavBar />

    <section class="main-content columns">
      <aside class="column is-2 section">
        <ul class="menu-list">
          <li>
            <nuxt-link
              to="/"
              exact-active-class="is-active">
              <b-icon icon="home" /> {{ $t("nav.home") }}
            </nuxt-link>
          </li>
          <li>
            <nuxt-link
              to="/configuration"
              exact-active-class="is-active">
              <b-icon icon="cog" /> {{ $t("nav.configuration") }}
            </nuxt-link>
          </li>
        </ul>
      </aside>

      <div class="container column is-10">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import TheNavBar from "@/components/global/TheNavBar";

export default {
  components: { TheNavBar },

  data () {
    return {
      appName: process.env.APP_NAME
    };
  }
};
</script>
