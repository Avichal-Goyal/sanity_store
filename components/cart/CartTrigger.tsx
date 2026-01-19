"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";

export function CartTrigger() {
  const { openCart } = useCartActions();
  const totalItems = useTotalItems();

  return (
    <Button
      onClick={openCart}
      variant="outline"
      size="icon"
      className="relative h-12 w-12 rounded-full shadow-lg"
    >
      <ShoppingBag className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {totalItems}
        </span>
      )}
    </Button>
  );
}