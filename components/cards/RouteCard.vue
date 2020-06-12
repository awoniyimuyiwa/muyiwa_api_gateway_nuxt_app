<template>
  <article class="media work-card">
    <div class="media-content">
      <div class="content">
        <p :class="{ 'has-background-grey-lighter': true }">
          <span class="has-text-success"> {{ $t("from") | capitalize }} </span>:
          {{ route.method | capitalize }} {{ route.path }}
          <br>
          <span class="has-text-success"> {{ $t("to") | capitalize }}:</span>
          <span
            v-for="serviceRoute in route.serviceRoutes"
            :key="serviceRoute.uniqueId">
            {{ serviceRoute.method | capitalize }} {{ serviceRoute.domain }} {{ serviceRoute.path }}<br />
          </span>
          <template>
            <br>
            <small>
              <a
                href="#"
                @click.prevent="edit">
                <b-icon
                  size="is-small"
                  icon="pencil">
                </b-icon>
                {{ $t("nav.edit") }}
              </a>
            </small>
            <small> |
              <a
                href="#"
                :disabled="isRemoving"
                class="has-text-danger"
                @click.prevent="confirmRemove">
                <b-icon
                  size="is-small"
                  icon="trash-can-outline">
                </b-icon>
                {{ $t("nav.remove") }}
              </a>
            </small>
          </template>
        </p>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "RouteCard",

  props: {
    route: {
      type: Object,
      default () {
        return {
          uniqueId: "",
          path: "",
          method: "",
          serviceRoutes: []
        };
      }
    }
  },

  data () {
    return {
      isRemoving: false
    };
  },

  methods: {
    edit () {
      this.$emit("edit", this.route);
    },

    confirmRemove () {
      if (this.isRemoving) { return; }
      this.isRemoving = true;

      this.$buefy.dialog.confirm({
        message: `${this.$t("nav.remove")}? ${this.$t("areYouSure")}`,
        confirmText: this.$t("yes"),
        cancelText: this.$t("no"),
        type: "is-warning",
        hasIcon: true,
        onConfirm: () => this.remove(),
        onCancel: () => {
          this.isRemoving = false;
        }
      });
    },

    remove () {
      this.$emit("remove", this.route);
      this.isRemoving = false;
    }
  }
};
</script>
