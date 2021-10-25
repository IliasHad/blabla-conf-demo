import { getProductSlugs, getProduct } from "../../lib/shopify";
import { CartContext } from "../../context/CartContext";
import { useContext } from "react";
import { Navigation } from "../../components/navigation";
import { Footer } from "../../components/footer";
import Image from "next/image";

export async function getStaticPaths() {
  const productSlugs = await getProductSlugs();
  const paths = productSlugs.map((slug) => {
    const handle = String(slug.node.handle);
    return {
      params: { handle },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  console.log(params);
  let productData = await getProduct(params.handle);
  return {
    props: { productData },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 5 seconds
    revalidate: 5,
  };
}

const ProductPage = ({ productData }) => {
  const { createNewCart } = useContext(CartContext);

  const onClickHandler = () => {
    createNewCart(productData.variants.edges[0].node.id, 1)
  }
  return (
    <div>
      <Navigation />

      <div className="mt-8 max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:auto-rows-min lg:gap-x-8">
          <div className="mt-8 lg:mt-0 lg:col-start-1 lg:col-span-7 lg:row-start-1 lg:row-span-3">
            <h2 className="sr-only">Images</h2>
            <Image
              alt={productData.title}
              src={productData.images.edges[0].node.originalSrc}
              height="500"
              width="400"
              quality={100}
              className="w-full h-full object-center object-cover group-hover:opacity-75"
            />
          </div>
          <div className="mt-8 lg:mt-0 lg:col-start-8 lg:col-span-7 lg:row-start-1 lg:row-span-3">
            <div className="flex justify-between">
              <h1 className="text-xl font-medium text-gray-900">
                {productData.title}
              </h1>
              <p className="text-xl font-medium text-gray-900">
                {productData.priceRange.minVariantPrice.amount}{" "}
                {productData.priceRange.minVariantPrice.currencyCode}
              </p>
            </div>
            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Description</h2>

              <div
                className="mt-4 prose prose-sm text-gray-500"
                dangerouslySetInnerHTML={{ __html: productData.description }}
              />
            </div>
            <button
              onClick={onClickHandler}
              className="mt-8 w-max bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default ProductPage;
