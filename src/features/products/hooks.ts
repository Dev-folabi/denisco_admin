"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  removeProduct,
  createProduct,
  getProducts,
  updateProduct,
} from "./api";
import type { ProductWrite } from "./types";

/** Query keys for the catalogue. */
export const productKeys = {
  all: ["admin", "products"] as const,
  list: (params: Record<string, unknown>) =>
    ["admin", "products", "list", params] as const,
};

/** Lists products for the management table. */
export function useAdminProducts(
  params: { search?: string; category?: string; status?: string } = {},
) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts({ ...params, limit: 100 }),
  });
}

/** Refreshes the catalogue and stock views after a change. */
function useInvalidateCatalogue() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all });
    queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
  };
}

/** Creates a product. */
export function useCreateProduct() {
  const invalidate = useInvalidateCatalogue();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: invalidate,
  });
}

/** Updates a product. */
export function useUpdateProduct() {
  const invalidate = useInvalidateCatalogue();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductWrite }) =>
      updateProduct(id, input),
    onSuccess: invalidate,
  });
}

/** Deletes a product, or archives it when orders refer to it. */
export function useRemoveProduct() {
  const invalidate = useInvalidateCatalogue();

  return useMutation({
    mutationFn: removeProduct,
    onSuccess: invalidate,
  });
}
