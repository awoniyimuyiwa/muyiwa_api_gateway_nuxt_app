import resourceApi from "~/api/resourceApi";
import routeApi from "~/api/routeApi";
import serviceApi from "~/api/serviceApi";

export default (ctx, inject) => {
  const serviceApiWithAxios = serviceApi(ctx.$axios);
  const resourceApiWithAxios = resourceApi(ctx.$axios);
  const routeApiWithAxios = routeApi(ctx.$axios);

  const apis = {
    resource: resourceApiWithAxios("resources"),
    route: routeApiWithAxios("routes"),
    service: serviceApiWithAxios("service")
  };

  inject("apis", apis);
};
