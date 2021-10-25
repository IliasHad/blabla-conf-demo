module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.shopify.com"],
  },
  env: {
    SHOPIFY_STORE_FRONT_ACCESS_TOKEN:
      process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN,
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
  },
};
