// Doc: https://www.npmjs.com/package/dotenv
require("dotenv").config();

const appName = process.env.APP_NAME || "API Gateway";
const appDescription = process.env.APP_DESCRIPTION || "API Gateway Portal";
const appDebug = process.env.APP_DEBUG || false;
const appHost = process.env.APP_HOST || "localhost";
const appPort = process.env.APP_PORT || 3000;
const appHttpScheme = process.env.APP_SECURE === "true" ? "https" : "http";
const appUrl = `${appHttpScheme}://${appHost}:3000`;
const appApiUrl = `${appHttpScheme}://${process.env.APP_API_HOST}:${process.env.APP_API_PORT}`;
const appNuxtMode = process.env.APP_NUXT_MODE || "universal";

export default {
  server: {
    host: "0.0.0.0", // default: localhost, 0.0.0.0 configures server to listen on all interfaces
    port: appPort // default: 3000
  },
  srcDir: __dirname,
  mode: appNuxtMode,
  /*
   ** Move output generated by nuxt generate into a parent directory
   ** so it is easier to mount it into a docker container during development
   ** Default is dist if not specified.
   ** See more about the issue this solves here: https://hashinteractive.com/blog/mounting-docker-volume-on-nuxt-generate-directory/
   */
  generate: {
    dir: "generate/dist"
  },
  /*
   ** Move output generated by nuxt build into a parent directory
   ** so it is easier to mount it into a docker container during development
   ** Default is .nuxt if not specified
   */
  buildDir: ".build/nuxt",
  /*
   ** Headers of the page
   */
  head: {
    title: "",
    // Note, it is not possible to use constants declared above in titleTemplate
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} | ${process.env.APP_NAME || "API Gateway"}` : `${process.env.APP_NAME || "API Gateway"}`;
    },
    meta: [
      { charset: "utf-8" },
      { name: "application-name", content: appName },
      { hid: "description", name: "description", content: appDescription },
      { name: "viewport", content: "width=device-width, initial-scale=1" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      // polyfill.io detects a browser's user-agent and adds polyfills needed for the browser.
      // That way, modern JS features in the code (ES2015, ES2016, ES2017 e.t.c) that are not in core-js will be supported in browsers as far back as IE7
      // Though Vue doesn’t support IE8 and below because it uses Object.defineProperty which is an un-shimmable feature"
      { src: "https://polyfill.io/v3/polyfill.min.js", body: true }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#eedc4e",
    continuous: true
  },
  /*
   ** Global CSS
   */
  css: ["@/assets/scss/main.scss"],
  /*
    ** Plugins to load before mounting the App
    */
  plugins: [
    "~/plugins/api",
    "~/plugins/axios",
    "~/plugins/custom-filters",
    "~/plugins/uniq-id",
    "~/plugins/vue2-filters",
    "~/plugins/vue-clampy",
    "~/plugins/vee-validate"
  ],
  /*
  ** The watch property lets you watch custom files for restarting the server.
  */
  watch: [
    "~/api/*.js"
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/dotenv-module
    ["@nuxtjs/dotenv", { systemvars: true }],
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module"
  ],
  /*
   ** Nuxt.js modules
   *  Arranged alphabetically to ease finding
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",

    // Doc: https://www.npmjs.com/package/cookie-universal-nuxt
    ["cookie-universal-nuxt"],

    // Doc: https://buefy.github.io/#/documentation
    ["nuxt-buefy", { css: false, materialDesignIcons: true }],

    // Doc: https://nuxt-community.github.io/nuxt-i18n
    ["nuxt-i18n", {
      baseUrl: appUrl,
      locales: [
        { code: "en", name: "English", iso: "en-US", file: "en.js" }
      ],
      defaultLocale: "en",
      lazy: true,
      langDir: "lang/",
      seo: false
    }]
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    /* Setting credentials to true configures axios to proxy all cookies, headers to api server
     * Applicable when API Authentication (e.g Laravel Passport)
     * allows passing token via cookies without having to use 'Authorization: Bearer <token>' header in requests
     */
    // credentials: true,
    debug: appDebug,
    headers: {
      common: {
        // Help servers know that this an XMLHttpRequest (xhr) request that wants a JSON response
        "X-Requested-With": "XMLHttpRequest"
      }
    },
    host: appHost,
    prefix: "/api-proxy",
    port: appPort,
    // Set proxy to true to prevent CORS limitation in browsers.
    // This is important when API server does not enable CORS.
    // That's why host and port have to be set to that of this app
    // and not to that of the API directly since this app is responsible for hosting
    // the proxy server that then proxies to API.
    proxy: true,
    proxyHeaders: true
  },
  /*
    ** Configure @nuxtjs/proxy module
    *  Proxy requests from appHost:appPort/api-proxy/... to appApiUrl/...
    */
  proxy: {
    "/api-proxy/": { target: appApiUrl, pathRewrite: { "^/api-proxy/": "" } }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        // Run Eslint on build
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  }
};
