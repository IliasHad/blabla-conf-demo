const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN;
async function callShopify(query, variables) {
  const fetchUrl = `https://${domain}/api/2021-10/graphql.json`;
  const fetchOptions = {
    endpoint: fetchUrl,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: variables || {} }),
  };

  try {
    const data = await fetch(fetchUrl, fetchOptions).then((response) =>
      response.json()
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAllProducts() {
  const query = `{
    products(first: 250) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 250) {
            edges {
              node {
                id
                originalSrc
                height
                width
                altText
              }
            }
          }
          options {
            name
            values
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 250) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                selectedOptions {
                  value
                }
                sku
                metafields(first: 250) {
                  edges {
                    node {
                      value
                      namespace
                      key
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  `;
  const response = await callShopify(query, {});

  let products = response?.data?.products.edges
    ? response.data.products.edges
    : [];
  return products;
}

export async function getProductSlugs() {
  const query = `{
    products(first:250) {
      edges {
            node {
              handle              
            }
          }
        
      }
    }`;
  const response = await callShopify(query);

  const slugs = response.data.products.edges
    ? response.data.products.edges
    : [];

  return slugs;
}

export async function getProduct(handle) {
  const query = `query productByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      images(first: 250) {
        edges {
          node {
            id
            originalSrc
            height
            width
            altText
          }
        }
      }
      options {
        name
        values
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 250) {
        edges {
          node {
            id
            title
            priceV2 {
              amount
              currencyCode
            }
            selectedOptions {
              value
              name
            }
            availableForSale
            sku
            metafields(first: 250) {
              edges {
                node {
                  value
                  namespace
                  key
                }
              }
            }
          }
        }
      }
    }
  }
  `;
  const response = await callShopify(query, { handle });

  const product = response.data.product ? response.data.product : [];

  return product;
}

export async function createCart(merchandiseId, quantity) {
    console.log(merchandiseId, quantity)
  const query = `
  mutation createCart($quantity: Int!, $id: ID!) {
    cartCreate(input: {lines: [{merchandiseId: $id, quantity: $quantity}]}) {
      cart {
        id
        checkoutUrl
        estimatedCost {
          totalTaxAmount {
            currencyCode
            amount
          }
          totalDutyAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 200) {
          edges {
            node {
              id
              quantity
              merchandise {
                ...variantFields
              }
              attributes {
                value
                key
              }
            }
          }
        }
      }
      userErrors {
        code
        message
      }
    }
  }
  
  fragment variantFields on ProductVariant {
    id
    title
    product {
      title
      handle
    }
    priceV2 {
      amount
      currencyCode
    }
    availableForSale
    image {
      originalSrc
      altText
    }
  }
  `;

  const response = await callShopify(query, {
    id: merchandiseId,
    quantity,
  });
  console.log(response.data.cartCreate.userErrors);
  const checkout = response.data.cartCreate.cart
    ? response.data.cartCreate.cart
    : [];


  return checkout;
}

export async function getCart(id) {
  const query = `query getCart($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      estimatedCost {
        totalTaxAmount {
          currencyCode
          amount
        }
        totalDutyAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 200) {
        edges {
          node {
            id
            quantity
            merchandise {
              ...variantFields
            }
            attributes {
              value
              key
            }
          }
        }
      }
    }
  }
  
  fragment variantFields on ProductVariant {
    id
    title
    product {
      title
      handle
    }
    priceV2 {
      amount
      currencyCode
    }
    availableForSale 
    image {
      originalSrc
      altText
    }
  }
  
  `;

  const response = await callShopify(query, {
    id: id,
  });
  console.log(id);
  console.log(response.data);
  const checkout = response.data?.cart ? response.data.cart : [];

  return checkout;
}

export async function removeItem(cartId, lineIds) {
  const query = `mutation removeItem($id: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $id, lineIds: $lineIds) {
      cart {
      id
      checkoutUrl
      estimatedCost {
        totalTaxAmount {
          currencyCode
          amount
        }
        totalDutyAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 200) {
        edges {
          node {
            id
            quantity
            merchandise {
              ...variantFields
            }
            attributes {
              value
              key
            }
          }
        }
      }
    }
  }
}

  
  fragment variantFields on ProductVariant {
    id
    title
    product {
      title
handle
    }
    priceV2 {
      amount
      currencyCode
    }
    availableForSale 
    image {
      originalSrc
      altText
    }
  }
  
  `;

  const response = await callShopify(query, {
    id: cartId,
    lineIds,
  });
  const checkout = response.data?.cartLinesRemove.cart
    ? response.data.cartLinesRemove.cart
    : [];

  return checkout;
}
