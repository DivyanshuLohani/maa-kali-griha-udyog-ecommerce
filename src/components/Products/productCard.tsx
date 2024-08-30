import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";
import { discountPercent, formatCurrency } from "@/lib/utils";
import AddToCart from "../Cart/AddToCart";
import { Badge } from "../ui/badge";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      {product.discountedPrice ? (
        <div className="absolute top-1 left-4 ">
          <Badge className="text-lg rounded-full" variant={"destructive"}>
            {discountPercent(product.price, product.discountedPrice)}% <br />
            Off
          </Badge>
        </div>
      ) : null}
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.imageUrl ?? ""}
            alt={product.name}
            fill
            className="object-cover hover:scale-110 duration-700 transition-transform"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg leading-tight h-12 overflow-hidden hover:underline">
            {product.name}
          </h3>
        </Link>
        <div className="flex gap-3 items-center">
          <span className="text-xl">
            ₹
            {formatCurrency(
              product.discountedPrice ? product.discountedPrice : product.price
            )}
          </span>
          {product.discountedPrice ? (
            <span>
              <span className="line-through">
                ₹ {formatCurrency(product.price)}
              </span>{" "}
              <span className="text-red-500 text-xl font-bold">
                {discountPercent(product.price, product.discountedPrice)}% off
              </span>
            </span>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <AddToCart product={product} className="w-full" />
      </CardFooter>
    </Card>
  );
}
