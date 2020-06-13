<template>
  <div>
    <section>
      <form
        :disabled="isSubmitting"
        @submit.prevent="submit">
        <p class="has-text-grey-light _minus_10_padding">
          {{ $tc("gatewayRoute", 1) | capitalize }}:
        </p>
        <div class="columns is-multiline">
          <div class="column">
            <b-field
              :label="$t('formFields.method')"
              :type="{'is-danger': errors.has('method')}"
              :message="errors.first('method')"
              expanded>
              <b-select
                v-model="route.method"
                v-validate="'required|min:3|max:255'"
                :data-vv-as="$t('formFields.method')"
                name="method"
                :placeholder="$t('choose')"
                expanded>
                <option
                  v-for="option in methods"
                  :key="option.value"
                  :value="option.value">
                  {{ option.name }}
                </option>
              </b-select>
            </b-field>
          </div>

          <div class="column">
            <b-field
              :label="$t('formFields.path')"
              :type="{'is-danger': errors.has('path')}"
              :message="errors.first('path')"
              expanded>
              <b-input
                v-model="route.path"
                v-validate="'required|min:3|max:255'"
                :data-vv-as="$t('formFields.path')"
                placeholder="/path/on/api-gateway"
                name="path"
                expanded>
              </b-input>
            </b-field>
          </div>
        </div>

        <!-- Start of service routes section -->
        <hr class="_minus_10_padding" />
        <p class="has-text-grey-light">
          {{ $tc("serviceRoute", 0) | capitalize }}:
        </p>
        <div
          v-for="(serviceRoute, index) in route.serviceRoutes"
          :key="serviceRoute.uniqueId">
          <hr />
          <nav class="level">
            <div class="level-left"></div>
            <div class="level-right">
              <p class="level-item">
                <a
                  href="#"
                  @click.prevent="removeServiceRoute(serviceRoute)">
                  <b-icon
                    icon="close"
                    size="is-small">
                  </b-icon>
                  {{ $t("nav.remove") }}
                </a>
              </p>
            </div>
          </nav>

          <div class="columns is-multiline">
            <div class="column">
              <b-field
                :label="$t('formFields.domain')"
                :type="{'is-danger': errors.has(`service_routes[${index}][domain]`)}"
                :message="errors.first(`service_routes[${index}][domain]`)"
                expanded>
                <!--name attribute for Array inputs use php array syntax, they should be updated to whatever syntax the back end api wants-->
                <b-input
                  v-model="serviceRoute.domain"
                  v-validate="'required'"
                  :data-vv-as="`${$t('formFields.domain') + (index+1)}`"
                  placeholder="xyz.com"
                  :name="`service_routes[${index}][domain]`"
                  expanded>
                </b-input>
              </b-field>
            </div>

            <div class="column">
              <b-field
                :label="$t('formFields.method')"
                :type="{'is-danger': errors.has(`service_routes[${index}][method]`)}"
                :message="errors.first(`service_routes[${index}][method]`)"
                expanded>
                <b-select
                  v-model="serviceRoute.method"
                  v-validate="'required'"
                  :data-vv-as="`${$t('formFields.method') + (index+1)}`"
                  :name="`service_routes[${index}][method]`"
                  :placeholder="$t('choose')"
                  expanded>
                  <option
                    v-for="option in methods"
                    :key="option.name"
                    :value="option.value">
                    {{ option.value }}
                  </option>
                </b-select>
              </b-field>
            </div>

            <div class="column">
              <b-field
                :label="$t('formFields.path')"
                :type="{'is-danger': errors.has(`service_routes[${index}][path]`)}"
                :message="errors.first(`service_routes[${index}][path]`)"
                expanded>
                <b-input
                  v-model="serviceRoute.path"
                  v-validate="'required|min:3|max:255'"
                  :data-vv-as="`${$t('formFields.path') + (index+1)}`"
                  placeholder="/path/on/xyz"
                  :name="`service_routes[${index}][path]`"
                  expanded>
                </b-input>
              </b-field>
            </div>
          </div>

          <p class="has-text-grey-light _minus_10_padding">
            <small>{{ $t("otherSettings") | capitalize }}</small>:
          </p>

          <div class="columns is-multiline">
            <div class="column">
              <b-field
                :label="$t('formFields.contentHandling')"
                :type="{'is-danger': errors.has(`service_routes[${index}][content_handling]`)}"
                :message="errors.first(`service_routes[${index}][content_handling]`)"
                expanded>
                <b-select
                  v-model="serviceRoute.contentHandling"
                  v-validate="'required'"
                  :data-vv-as="`${$t('formFields.contentHandling') + (index+1)}`"
                  :name="`service_routes[${index}][content_handling]`"
                  :placeholder="$t('choose')"
                  expanded>
                  <option value="passthrough">
                    Pass Through
                  </option>
                  <option value="to_binary">
                    To Binary
                  </option>
                  <option value="to_text">
                    To Text
                  </option>
                </b-select>
              </b-field>
            </div>

            <div class="column">
              <b-field
                :label="$t('formFields.requestInterceptor')"
                :type="{'is-danger': errors.has(`service_routes[${index}][request_interceptor]`)}"
                :message="errors.first(`service_routes[${index}][request_interceptor]`)"
                expanded>
                <b-select
                  v-model="serviceRoute.requestInterceptor"
                  :data-vv-as="`${$t('formFields.requestInterceptor') + (index+1)}`"
                  :name="`service_routes[${index}][request_interceptor']`"
                  :placeholder="$t('choose')"
                  expanded>
                  <option value="Interceptor1">
                    Interceptor1
                  </option>
                </b-select>
              </b-field>
            </div>

            <div class="column">
              <b-field
                :label="$t('formFields.responseInterceptor')"
                :type="{'is-danger': errors.has('response_interceptor')}"
                :message="errors.first('response_interceptor')"
                expanded>
                <b-select
                  v-model="serviceRoute.responseInterceptor"
                  :data-vv-as="`${$t('formFields.responseInterceptor') + (index+1)}`"
                  :name="`service_routes[${index}][response_interceptor]`"
                  :placeholder="$t('choose')"
                  expanded>
                  <option value="Interceptor1">
                    Interceptor1
                  </option>
                </b-select>
              </b-field>
            </div>
          </div>
        </div>

        <div class="has-text-centered has-background-grey-lighter _plus_10_padding ">
          <button
            type="button"
            class="button is-"
            @click="addServiceRoute">
            {{ $t("addServiceRoute") }}
          </button>
        </div>

        <div class="field is-grouped has-margin-top-md is-grouped-right">
          <div class="control">
            <button
              type="button"
              class="button is-rounded is-light"
              @click="cancel">
              {{ $t("nav.cancel") }}
            </button>
            <button
              type="submit"
              class="button is-rounded is-primary">
              {{ initialData.uniqueId ? $t("nav.save") : $t("nav.add") }}
            </button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
export default {
  name: "RouteForm",

  $_veeValidate: {
    validator: "new" // give me my own validator scope.
  },

  props: {
    initialData: {
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
      /*
       ** Completely eliminate references to avoid errors that may occur due to
       ** manipulating an obect coming from vuex store from outside the vuex store
       ** deep clone route = JSON.parse(JSON.stringify(initialData));
      */
      route: {
        uniqueId: this.initialData.uniqueId,
        path: this.initialData.path,
        method: this.initialData.method,
        serviceRoutes: this.initialData.serviceRoutes
          ? this.initialData.serviceRoutes.map(item => ({
            uniqueId: item.uniqueId,
            domain: item.domain,
            path: item.path,
            method: item.method,
            contentHandling: item.contentHandling,
            requestInterceptor: item.requestInterceptor,
            responseInterceptor: item.responseInterceptor
          })) : []
      },
      isSubmitting: false,
      methods: [
        { name: "GET", value: "GET" },
        { name: "POST", value: "POST" },
        { name: "PUT", value: "PUT" },
        { name: "PATCH", value: "PATCH" },
        { name: "DELETE", value: "DELET" },
        { name: "ALL", value: "ALL" }
      ]
    };
  },

  methods: {
    addServiceRoute () {
      const serviceRoute = {
        uniqueId: this.$uniqueId(),
        domain: "",
        path: "",
        method: "",
        contentHandling: "",
        requestInterceptor: "",
        responseInterceptor: ""
      };

      this.route.serviceRoutes.push(serviceRoute);
    },

    removeServiceRoute (serviceRoute) {
      const index = this.route.serviceRoutes.findIndex(item => item.uniqueId === serviceRoute.uniqueId);
      if (index === -1) { return; }

      this.route.serviceRoutes.splice(index, 1);
    },

    cancel () {
      this.$emit("cancel");
    },

    async submit () {
      if (this.isSubmitting) { return; }
      this.isSubmitting = true;

      const isInputValid = await this.$validator.validateAll();
      if (!isInputValid) {
        this.$buefy.toast.open({ message: this.$t("errors.thereWereProblems"), type: "is-danger", position: "is-top" });
        this.isSubmitting = false;
        return;
      }

      this.$emit("submit", this.route);
      this.isSubmitting = false;
    }
  }
};
</script>

<style>
  ._minus_10_padding {
    margin-top: -10px; margin-bottom: 10px
  }
  ._plus_10_padding {
    margin-top: 10px; margin-bottom: 10px
  }
</style>
