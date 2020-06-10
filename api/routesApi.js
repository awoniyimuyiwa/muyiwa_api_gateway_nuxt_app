export default $axios => resource => ({
  index (params = {}) {
    return $axios.get(`${resource}`, {
      params
    });
  },

  show (id) {
    return $axios.get(`${resource}/${id}`);
  },

  create (payload) {
    return $axios.post(`${resource}`, payload);
  },

  update (id, payload) {
    // Payload must contain _method=put
    return $axios.post(`${resource}/${id}`, payload);
  },

  delete (id) {
    return $axios.delete(`${resource}/${id}`);
  }
});
