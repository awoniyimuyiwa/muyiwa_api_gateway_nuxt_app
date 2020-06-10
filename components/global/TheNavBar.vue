<template>
  <nav
    class="navbar header has-shadow is-primary"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <!--<img src="~assets/buefy.png" alt="Buefy" height="28" />-->
        {{ appName }}
      </a>

      <div class="navbar-burger">
        <span />
        <span />
        <span />
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TheNavBar",
  data () {
    return {
      appName: process.env.APP_NAME
    };
  },

  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
      user: "auth/user",
      isInRole: "auth/isInRole"
    })
  }
};
</script>
