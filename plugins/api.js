import gatewayConfigApi from "~/api/gatewayConfigApi";

export default (ctx, inject) => {
  const gatewayConfigApiWithAxios = gatewayConfigApi(ctx.$axios);

  const apis = {
    gatewayConfig: gatewayConfigApiWithAxios("configuration")
  };

  inject("apis", apis);
};
