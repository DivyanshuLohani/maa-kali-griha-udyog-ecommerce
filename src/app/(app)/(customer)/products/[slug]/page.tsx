import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import { Suspense } from "react";
import { fetchProduct, fetchProductWithSlug } from "@/lib/data";
import ProductDescription from "@/components/Products/ProductDescription";
import { Separator } from "@radix-ui/react-select";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await fetchProduct(3);

  if (!product) return notFound();

  return {
    title: product.name,
    description: product.description,

    openGraph: product.imageUrl
      ? {
          images: [
            {
              url: product.imageUrl,
              width: 512,
              height: 512,
              alt: "Product Image",
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await fetchProductWithSlug(params.slug);

  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
        <div className="h-full basis-full lg:basis-4/6 w-2/5">
          <Suspense
            fallback={
              <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
            }
          >
            <Gallery
              // productName={product.name}
              images={[
                {
                  src: product.imageUrl ?? "",
                  altText: "Featured Image",
                },
                ...product.images.map((e) => ({
                  src: e.imageUrl,
                  altText: "Product Image",
                })),
              ]}
            />
          </Suspense>
        </div>

        <div className="basis-full lg:basis-2/6 space-y-10 w-full">
          <ProductDescription product={product} />

          <Separator className="my-12" />
        </div>
      </div>
      {/* <RelatedProducts id={product.id} /> */}
    </div>
  );
}

// async function RelatedProducts({ id }: { id: number }) {
//   const relatedProducts = await getProductRecommendations(id);

//   if (!relatedProducts.length) return null;

//   return (
//     <div className="py-8">
//       <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
//       <ul className="flex w-full gap-4 overflow-x-auto pt-1">
//         {relatedProducts.map((product) => (
//           <li
//             key={product.handle}
//             className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
//           >
//             <Link
//               className="relative h-full w-full"
//               href={`/product/${product.handle}`}
//               prefetch={true}
//             >
//               <GridTileImage
//                 alt={product.title}
//                 label={{
//                   title: product.title,
//                   amount: product.priceRange.maxVariantPrice.amount,
//                   currencyCode: product.priceRange.maxVariantPrice.currencyCode,
//                 }}
//                 src={product.featuredImage?.url}
//                 fill
//                 sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
//               />
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
