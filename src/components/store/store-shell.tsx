"use client";

import { StoreHeader } from "./store-header";
import { CartProvider } from "./cart-context";
import type { ReactNode } from "react";

function StoreContents({ children }: { children: ReactNode }) {
  return (
    <>
      <StoreHeader />
      {children}
    </>
  );
}

export function StoreShell({ children }: { children: ReactNode }) {
  return <CartProvider><StoreContents>{children}</StoreContents></CartProvider>;
}
