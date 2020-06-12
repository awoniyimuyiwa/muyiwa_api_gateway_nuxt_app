<template>
  <div>
    <div class="has-text-centered has-margin-bottom-md">
      <b-icon
        icon="cog"
        type="is-default"></b-icon>
    </div>

    <div
      v-if="items.length"
      key="items">
      <div
        v-for="route in items"
        :key="route.uniqueId"
        class="box">
        <RouteCard
          :route="route"
          @edit="onEdit"
          @remove="onRemove" />
      </div>
    </div>
    <div
      v-else
      class="has-text-centered">
      <p class="has-text-grey-light">
        {{ $t("pagination.empty") }}
      </p>
    </div>
  </div>
</template>

<script>
import RouteCard from "@/components/cards/RouteCard";

export default {
  name: "RouteList",

  components: {
    RouteCard
  },

  props: {
    items: {
      type: Array,
      default () {
        return [];
      }
    }
  },

  methods: {
    onEdit (route) {
      this.$emit("edit-item", route);
    },

    onRemove (route) {
      this.$emit("remove-item", route);
    }
  }
};
</script>
