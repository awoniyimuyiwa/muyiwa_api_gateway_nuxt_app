import { ToastProgrammatic as Toast } from "buefy";

/**
 * @param $axios
 * @param app
 * @param store
 * @param route
 * @param redirect
 * @param error
 */
export default ({ $axios, app, store, route, redirect, error }) => {
  /**
   * Axios request interceptor
   */
  $axios.onRequest((config) => {
    config.headers.common["X-Requested-With"] = "XMLHttpRequest";

    let apiToken = process.env.APP_API_TOKEN_FOR_TEST;
    if (process.env.APP_ENV === "production" || !apiToken) {
      apiToken = app.$cookies.get(process.env.APP_API_TOKEN_COOKIE_NAME, { parseJSON: false });
    }

    // Adds header: `Authorization: Bearer <Token>` to all requests
    // $axios.setToken(process.env.APP_API_TOKEN_FOR_TEST, "Bearer");
    if (apiToken) {
      config.headers.common.Authorization = `Bearer ${apiToken}`;
    }

    return config;
  });

  /**
     * The request was made but no response was received,
     * or the server is down or no network connection.
     * `error.request` is an instance of XMLHttpRequest in the browser and an instance of
     * http.ClientRequest in node.js
     */
  $axios.onRequestError((axiosError) => {
    console.log("axios request error"); // eslint-disable-line no-console
    // Tag the error object for identification
    axiosError._myType = "axios";

    // eslint-disable-next-line no-prototype-builtins
    if (axiosError.config.hasOwnProperty("errorHandle") &&
      axiosError.config.errorHandle === false) {
      return Promise.reject(axiosError);
    }

    return handleNoResponseError(axiosError);
  });
  /**
     *  The request was made and the server responded with a status code
     *  that falls out of the range of 2xx.
     *
     *  No action for 400 & 422 errors here,
     *  the code making the axios call is responsible for acting on them
     *
     *  @see https://github.com/nuxt-community/axios-module/issues/241
     */
  $axios.onResponseError((axiosError) => {
    // console.log("axios response error"); // eslint-disable-line no-console

    // Tag the error object for identification
    axiosError._myType = "axios";

    if (axiosError.config &&
      // eslint-disable-next-line no-prototype-builtins
      axiosError.config.hasOwnProperty("errorHandle") &&
      axiosError.config.errorHandle === false) {
      return Promise.reject(axiosError);
    }

    // Still don't know why axios still calls this interceptor when there is no response from server
    if (!axiosError.response) { return handleNoResponseError(axiosError); }

    let errorMessage = axiosError.message || app.i18n.t("errors.somethingWrong");
    if (axiosError.response.data &&
      // eslint-disable-next-line no-prototype-builtins
      axiosError.response.data.hasOwnProperty("message")) {
      // Laravel puts response error message in data.message
      errorMessage = axiosError.response.data.message;
    }

    // +num returns the numeric value of a string, or NaN if a string isn't purely numeric characters
    const errorCode = +axiosError.response.status;
    if (errorCode === 401) {
      // User authentication required, clear auth store and redirect to login page with nuxt redirect function
      if (store.getters["auth/isAuthenticated"]) { store.dispatch("auth/logoutUser"); }
      const appHttpScheme = process.env.APP_SECURE ? "https" : "http";
      const appUrl = `${appHttpScheme}://${process.env.APP_HOST}:${process.env.APP_PORT}`;
      redirect(`${process.env.APP_LOGIN_URL}?redirectUrl=${appUrl}/${route.path}`);
      return Promise.reject(axiosError);
    } else if (errorCode === 400 || errorCode === 422) {
      // Calling code is responsible for handling and displaying bad request(400) and input validation(422) errors in dialogs and toasts
      if (process.client) { return Promise.reject(axiosError); }
    }

    // At this stage, invoke nuxt error function, e.g  for 404, 500, 503, 504 and all other errors,
    error({ statusCode: errorCode, message: errorMessage });

    return Promise.reject(axiosError);
  });
  /**
     * @param axiosError
     */
  function handleNoResponseError (axiosError) {
    // console.log("no response error"); // eslint-disable-line no-console
    const errorCode = +axiosError.status;
    let errorMessage = axiosError.message || app.i18n.t("errors.somethingWrong");

    if (errorMessage === "Network Error") { errorMessage = app.i18n.t("errors.network"); }

    if (process.client) {
      Toast.open({ message: errorMessage, type: "is-danger", position: "is-top" });
    } else {
      error({ statusCode: errorCode, message: errorMessage });
    }

    return Promise.reject(axiosError);
  }
};
