import ProductCard from "@/components/Products/productCard";
import Paginator from "@/components/ui/paginator";
import { fetchProducts, findCategoryByString } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page ?? "1");
  const perPage = 48;
  const category = await findCategoryByString(params.slug);
  if (!category) notFound();
  const { products, totalProducts } = await fetchProducts(
    page,
    "",
    perPage,
    category.id
  );

  return (
    <div className="px-5 md:px-10 py-10">
      <div className="heading text-lg">
        {totalProducts} product{totalProducts > 1 ? "s" : ""} in category &quot;
        {category.name}&quot; <br />
        <span className="text-sm">
          Showing {Math.min((page - 1) * perPage, totalProducts) + 1} -{" "}
          {Math.min(page * perPage, totalProducts)} of {totalProducts} products
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-10">
        {products.map((e) => {
          return <ProductCard key={e.id} product={e} />;
        })}
      </div>
      <Paginator perPage={perPage} total={totalProducts} />
    </div>
  );
}
