"use client";
import { useCart } from "@/context/CartProvider";
import { formatCurrency } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const MIN_ORDER_VALUE =
  Number(process.env.NEXT_PUBLIC_MIN_ORDER_VALUE as string) || 49900;
const CartSummary = () => {
  const { products, cartTotal, setCartOpen } = useCart();
  const router = useRouter();

  return (
    <div className="mb-6 md:mb-0 md:w-1/2">
      <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
      <ul className="space-y-4">
        {products.map((item) => (
          <li
            key={item.product.id}
            className="flex justify-between"
            suppressHydrationWarning
          >
            {item.product.name} - ₹{" "}
            {formatCurrency(
              item.product.discountedPrice
                ? item.product.discountedPrice
                : item.product.price
            )}{" "}
            x {item.quantity}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <h3 className="text-lg font-bold">
          Total: ₹ {formatCurrency(cartTotal)}
          <br />
          {cartTotal < MIN_ORDER_VALUE && (
            <>
              <span className="text-sm text-red-500">
                Cart value must be greater than Rs.{" "}
                {formatCurrency(MIN_ORDER_VALUE)}
              </span>
              <br />
              <span className="text-sm text-red-500">
                Add items worth Rs.{" "}
                {formatCurrency(MIN_ORDER_VALUE - cartTotal)} to proceed to
                checkout
              </span>
              <br />
              <Button
                onClick={() => {
                  setCartOpen(false);
                  router.push("/");
                }}
              >
                Browse Products
              </Button>
            </>
          )}
        </h3>
      </div>
    </div>
  );
};

export default CartSummary;
