const getDefaultState = () => {
  return {
    routes: [
      {
        uniqueId: "sample_id",
        path: "/home",
        method: "GET",
        serviceRoutes: [
          {
            uniqueId: "sample_id",
            domain: "xyz.com",
            path: "/home",
            method: "GET",
            contentHandling: "", // [passthrough|to_binary|to_text]
            requestInterceptor: "",
            responseInterceptor: ""
          }
        ]
      }
    ]
  };
};

const state = () => {
  return getDefaultState();
};

const getters = {
  getRoutes: (state, getters) => state.routes,

  check: (state, getters) => state.routes.length
};

const mutations = {
  // Assign unique Ids to each item before adding them to the list
  ADD_ROUTE (state, payload) {
    payload.uniqueId = this.$uniqueId();
    payload.serviceRoutes.forEach((serviceRoute, index) => {
      serviceRoute.uniqueId = this.$uniqueId();
    });

    // Add to top of the list
    state.routes.unshift(payload);
  },

  UPDATE_ROUTE (state, payload) {
    const index = state.routes.findIndex(item => item.uniqueId === payload.uniqueId);
    if (index === -1) { return; }

    payload.serviceRoutes.forEach((serviceRoute, index) => {
      if (!serviceRoute.uniqueId) {
        serviceRoute.uniqueId = this.$uniqueId();
      }
    });

    state.routes.splice(index, 1, payload);
    // this.$Vue.set(state.routes, index, payload);
    // state.routes[index] = payload;
  },

  REMOVE_ROUTE (state, uniqueId) {
    const index = state.routes.findIndex(item => item.uniqueId === uniqueId);
    if (index === -1) { return; }

    state.routes.splice(index, 1);
  },

  RESET_STATE (state) {
    state = Object.assign(state, getDefaultState());
  }
};

const actions = {
  async fetch ({ state, getters, commit, dispatch, rootState, rootGetters }) {
    const { data } = await this.$apis.gatewayConfigApi.show();
    const routes = data.data;
    routes.forEach(function (route, index) {
      commit("ADD_ROUTE", route);
    });
  },

  addRoute ({ state, getters, commit, dispatch, rootState, rootGetters }, payload) {
    // if (!getters.check) { dispatch("fetch"); }

    commit("ADD_ROUTE", payload);
  },

  updateRoute ({ state, getters, commit, dispatch, rootState, rootGetters }, payload) {
    commit("UPDATE_ROUTE", payload);
  },

  removeRoute ({ state, getters, commit, dispatch, rootState, rootGetters }, uniqueId) {
    commit("REMOVE_ROUTE", uniqueId);
  },

  resetState ({ state, getters, commit, dispatch, rootState, rootGetters }) {
    commit("RESET_STATE");
  }
};

export default {
  state, getters, mutations, actions
};
