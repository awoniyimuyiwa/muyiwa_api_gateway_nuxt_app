module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: [
    "@nuxtjs",
    "plugin:nuxt/recommended",
    "plugin:vue/strongly-recommended"
  ],
  plugins: [
    // required to lint *.vue files
    "vue"
  ],
  // add your custom rules here
  rules: {
    "no-alert": "error",
    "no-console": "error",
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "vue/component-tags-order": ["error", {
      "order": ["template", "script", "style"]
    }],
    "vue/html-closing-bracket-newline": "off",
    "vue/html-self-closing": "off",
  }
};
