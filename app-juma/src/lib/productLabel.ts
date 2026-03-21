import type { Product } from "../types";

export function getProductDisplayName(product: Pick<Product, "name" | "subName">) {
  const name = product.name?.trim() ?? "";
  const subName = product.subName?.trim() ?? "";
  return name || subName || "Sin nombre";
}
