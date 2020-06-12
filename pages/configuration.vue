<template>
  <section class="section">
    <div class="columns is-centered is-multiline">
      <div class="column is-10 is-multiline">
        <div class="columns">
          <div class="column">
            <nav class="level">
              <div class="level-left"></div>
              <div class="level-right">
                <p class="level-item">
                  <a
                    href="#"
                    @click.prevent="showConfigurationForm(initialRoute)">
                    <b-icon
                      icon="plus"
                      size="is-small">
                    </b-icon>
                    {{ $t("newEntry") }}
                  </a>
                </p>
              </div>
            </nav>

            <RouteList
              v-show="showRouteList"
              :items="routes"
              @edit-item="showConfigurationForm"
              @remove-item="onRemoveRoute" />

            <div
              v-show="!showRouteList"
              class="box">
              <h4 class="title is-5">
                {{ route && route.uniqueId ? $t("nav.edit") : $t("newEntry") }}
              </h4>

              <b-notification
                type="is-info"
                has-icon>
                <p class="has-text-centered">
                  {{ $t("configurationExp") }}
                </p>
              </b-notification>

              <!-- The same form is used for all routes, since vue props
              are not reactive, the component is assigned a reactive key attribute to force
              vue to re-render it when the Route object is changed -->
              <RouteForm
                v-if="route"
                :key="route.uniqueId || ''"
                :initial-data="route"
                @cancel="resetPage"
                @submit="onSubmitRoute" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import RouteList from "@/components/lists/RouteList";
import RouteForm from "@/components/forms/RouteForm";
import errorHandlerMixin from "@/mixins/errorHandler";
import "formdata-polyfill";

export default {
  name: "ConfigurationPage",

  components: {
    RouteList,
    RouteForm
  },

  mixins: [errorHandlerMixin],

  props: {
    initialRoute: {
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

  /* async fetch (context) {
    try {
      // Fill config into store
      // ToDo: When API is available fetch and fille the entire config into store
      await context.store.dispatch("gatewayConfig/fetch");
    } catch (e) {
      if (e._myType !== "axios") { throw e; }
    }
  }, */

  data () {
    return {
      route: null,
      showRouteList: true
    };
  },

  computed: {
    ...mapGetters({
      routes: "gatewayConfig/getRoutes"
    }),

    pageTitle () {
      return this.$t("nav.configuration");
    }
  },

  methods: {
    ...mapActions({
      addRoute: "gatewayConfig/addRoute",
      updateRoute: "gatewayConfig/updateRoute",
      removeRoute: "gatewayConfig/removeRoute",
      refresh: "gatewayConfig/fetch"
    }),

    showConfigurationForm (route) {
      this.route = Object.assign({}, route);
      this.showRouteList = false;
    },

    resetPage () {
      this.showRouteList = true;
      this.route = null;
    },

    /* async onSubmit (route) {
      // ToDo: When API is available Just sync the entire config with backend since data is shared,
      // instead of manipulating items in store
      await this.submitAndRefresh(route, false);
    }, */

    onSubmitRoute (route) {
      // Temporary implementation
      let status = "routeAdded";

      if (route.uniqueId) {
        this.updateRoute(route);
        status = "routeUpdated";
      } else {
        // Newly added routes don't have unique Id yet
        this.addRoute(route);
      }

      this.$buefy.toast.open({
        message: this.$t(`status.${status}`),
        type: "is-success",
        position: "is-top"
      });

      this.resetPage();
    },

    /* async onRemove (route) {
      // ToDo: When API is available Just sync the entire config with backend since data is shared,
      await this.submitAndRefresh(route, true);
    }, */

    onRemoveRoute (route) {
      this.removeRoute(route.uniqueId);

      this.$buefy.toast.open({
        message: this.$t("status.routeRemoved"),
        type: "is-success",
        position: "is-top"
      });
    },

    async submitAndRefresh (routeFromForm, isForRemove = false) {
      const data = this.addAllRoutesToFormData(routeFromForm, isForRemove);

      try {
        await this.$apis.gatewayConfig.submit(data);
        this.$buefy.toast.open({
          message: this.$t("status.configurationSaved"),
          type: "is-success",
          position: "is-top"
        });

        this.refresh();
        if (!isForRemove) { this.resetPage(); }
      } catch (e) {
        if (e._myType !== "axios") { throw e; }
      }
    },

    addAllRoutesToFormData (routeFromForm, isForRemove) {
      const formData = new FormData();
      let formDataIndex = 0;

      if (!routeFromForm.uniqueId) {
        // Newly added route,
        // Build nested array with formData using php array syntax.
        // https://stackoverflow.com/questions/28774746/sending-nested-formdata-on-ajax
        formData.append(`routes[${formDataIndex}][path]`, routeFromForm.path);
        formData.append(`routes[${formDataIndex}][method]`, routeFromForm.method);
        this.addServiceRoutesToFormData(routeFromForm, formData, formDataIndex);
      }

      let routeIndex = 0;
      let routeAtIndex = null;
      while (routeIndex < this.routes.length) {
        routeAtIndex = this.routes[routeIndex];
        if (isForRemove && routeAtIndex === routeFromForm.uniqueId) {
          // The route was deleted don't bother adding
          continue;
        }

        formDataIndex++;
        if (routeAtIndex.uniqueId === routeFromForm.uniqueId) {
          // The route was updated
          routeAtIndex = routeFromForm;
        }

        formData.append(`routes[${formDataIndex}][path]`, routeAtIndex.path);
        formData.append(`routes[${formDataIndex}][method]`, routeAtIndex.method);
        this.addServiceRoutesToFormData(routeAtIndex, formData, formDataIndex);

        routeIndex++;
      }

      return formData;
    },

    addServiceRoutesToFormData (route, formData, formDataIndex) {
      let serviceRoute = null;
      let serviceRouteIndex = 0;
      let serviceRouteKeyPrefix = "";
      while (serviceRouteIndex < route.serviceRoutes.length) {
        serviceRoute = route.serviceRoutes[serviceRouteIndex];
        serviceRouteKeyPrefix = `routes[${formDataIndex}][service_routes][${serviceRouteIndex}]`;
        formData.append(`${serviceRouteKeyPrefix}[domain]`, serviceRoute.domain);
        formData.append(`${serviceRouteKeyPrefix}[method]`, serviceRoute.method);
        formData.append(`${serviceRouteKeyPrefix}[path]`, serviceRoute.path);
        formData.append(`${serviceRouteKeyPrefix}[request_interceptor]`, serviceRoute.requestInterceptor);
        formData.append(`${serviceRouteKeyPrefix}[response_interceptor]`, serviceRoute.responseInterceptor);
        formData.append(`${serviceRouteKeyPrefix}[content_handling]`, serviceRoute.contentHandling);
        serviceRouteIndex++;
      }
    }
  },

  head () {
    return {
      title: this.pageTitle
    };
  }
};
</script>
