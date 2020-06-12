import Vue from "vue";

Vue.filter("capitalize", function (value) {
  return value.toUpperCase();
});

Vue.filter("formatNumber", function (value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});
