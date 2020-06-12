export default {
  methods: {
    /**
         * Errors that are not from axios will be re-thrown, this is very essential
         * because errors in Promise .then callbacks will also end up in .catch callbacks.
         *
         * Only 400 and 422 response errors from axios are handled here
         * errors without response and all other errors
         * have been handled in axios error interceptors in /plugins/axios.js
         * @param e
         */
    handleAxiosError (e) {
      if (e._myType !== "axios") { throw e; }
      if (!e.response) { return; }

      // +num returns the numeric value of a string, or NaN if a string isn't purely numeric characters
      const statusCode = +e.response.status;
      const data = e.response.data;
      const message = data.message;

      if (statusCode === 400) {
        // Buefy dialog seems to be distorting pages that have a lot of content
        this.$buefy.dialog.alert({ message, type: "is-danger", hasIcon: true });
        // this.$buefy.toast.open({message: message, type: "is-danger", position: "is-top"});
      } else if (statusCode === 422) {
        this.$buefy.toast.open({ message: this.$t("errors.thereWereProblems"), type: "is-danger", position: "is-top" });
        // this.$setLaravelValidationErrorsFromResponse(data);
      }
    }
  }
};
