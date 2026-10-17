"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDeliveryLocation,
  getDeliveryOffering,
  removeDeliveryLocation,
  setDeliveryEnabled,
  updateDeliveryLocation,
} from "./api";
import type { DeliveryLocationWrite } from "./types";

/** Query keys for the home-delivery offering. */
export const deliveryKeys = {
  all: ["admin", "delivery"] as const,
  offering: ["admin", "delivery", "offering"] as const,
};

/** Loads the delivery settings and every area. */
export function useDeliveryOffering() {
  return useQuery({
    queryKey: deliveryKeys.offering,
    queryFn: getDeliveryOffering,
  });
}

/** Refreshes the offering after any change to it. */
function useInvalidateDelivery() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
  };
}

/** Switches home delivery on or off. */
export function useSetDeliveryEnabled() {
  const invalidate = useInvalidateDelivery();

  return useMutation({
    mutationFn: setDeliveryEnabled,
    onSuccess: invalidate,
  });
}

/** Adds a delivery area. */
export function useCreateDeliveryLocation() {
  const invalidate = useInvalidateDelivery();

  return useMutation({
    mutationFn: createDeliveryLocation,
    onSuccess: invalidate,
  });
}

/** Updates a delivery area. */
export function useUpdateDeliveryLocation() {
  const invalidate = useInvalidateDelivery();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: DeliveryLocationWrite }) =>
      updateDeliveryLocation(id, input),
    onSuccess: invalidate,
  });
}

/** Removes a delivery area. */
export function useRemoveDeliveryLocation() {
  const invalidate = useInvalidateDelivery();

  return useMutation({
    mutationFn: removeDeliveryLocation,
    onSuccess: invalidate,
  });
}
