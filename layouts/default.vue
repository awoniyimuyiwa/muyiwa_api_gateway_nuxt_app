<template>
  <div>
    <TheNavBar />

    <section class="main-content columns">
      <aside class="column is-2 section">
        <ul class="menu-list">
          <li>
            <nuxt-link to="/" exact-active-class="is-active">
              <b-icon icon="home" /> {{ $t("nav.home") }}
            </nuxt-link>
          </li>
          <li>
            <ul>
              <li>
                <p class="menu-label is-hidden-touch">
                  {{ $t("nav.services") }}
                </p>
              </li>
            </ul>
          </li>
          <li>
            <nuxt-link
              to="/wallets"
              exact-active-class="is-active">
              <b-icon icon="wallet" /> {{ $t("nav.wallets") }}
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
