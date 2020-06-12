const uniqueId = require("uniqid");

export default ({ app }, inject) => {
  inject("uniqueId", () => uniqueId.time());
};
