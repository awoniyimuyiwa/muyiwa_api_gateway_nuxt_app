import Vue from "vue";

import { Validator, install as VeeValidate } from "vee-validate/dist/vee-validate.minimal.esm";
// eslint-disable-next-line camelcase
import { excluded, max, max_value, min, min_value, numeric, required, required_if } from "vee-validate/dist/rules.esm";
import veeEn from "vee-validate/dist/locale/en";
// import customVeeEn from "~/lang/enVee";

// Add the rules you need.
Validator.extend("excluded", excluded);
Validator.extend("max", max);
Validator.extend("max_value", max_value);
Validator.extend("min", min);
Validator.extend("min_value", min_value);
Validator.extend("numeric", numeric);
Validator.extend("required", required);
Validator.extend("required_if", required_if);

/**
 *  Integrate vee-validate with i18n.
 *  Custom lang dictionaries will be merged with
 *  their default vee-validate lang dictionaries and added to a validation key in lang files.
 *
 *  Also integrate vee-validate-laravel to help merge laravel API validation errors to vee-validate
 *
 * @param ctx
 * @param inject
 */
export default ({ app }, inject) => {
  Vue.use(VeeValidate, {
    inject: false, // This will make the plugin stop instantiating a new validator scope for each component instance, excluding the root instance.
    i18nRootKey: "validation",
    i18n: app.i18n,
    dictionary: {
      en: veeEn
      // en: customVeeEn
    }
  });
};
