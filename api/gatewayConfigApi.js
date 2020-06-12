export default $axios => resource => ({
  show () {
    return $axios.get(`${resource}`);
  },

  update (payload) {
    // Payload must contain _method=put
    return $axios.post(`${resource}`, payload);
  }
});
