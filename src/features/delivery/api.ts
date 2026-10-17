import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
  DeliveryLocation,
  DeliveryLocationWrite,
  DeliveryOffering,
} from "./types";

/**
 * Retrieves the home-delivery settings and every area, retired ones included.
 */
export async function getDeliveryOffering(): Promise<DeliveryOffering> {
  return apiClient.get<DeliveryOffering>(ENDPOINTS.delivery.offering);
}

/** Switches home delivery on or off for every area at once. */
export async function setDeliveryEnabled(
  enabled: boolean,
): Promise<DeliveryOffering> {
  return apiClient.patch<DeliveryOffering>(ENDPOINTS.delivery.offering, {
    enabled,
  });
}

/** Adds a delivery area. */
export async function createDeliveryLocation(
  input: DeliveryLocationWrite,
): Promise<DeliveryLocation> {
  return apiClient.post<DeliveryLocation>(ENDPOINTS.delivery.locations, input);
}

/** Applies a partial change to a delivery area. */
export async function updateDeliveryLocation(
  id: string,
  input: DeliveryLocationWrite,
): Promise<DeliveryLocation> {
  return apiClient.patch<DeliveryLocation>(
    ENDPOINTS.delivery.location(id),
    input,
  );
}

/**
 * Removes a delivery area.
 *
 * Orders already delivered there keep their own snapshot of the name and the
 * fee, so history does not break.
 */
export async function removeDeliveryLocation(id: string): Promise<void> {
  await apiClient.delete<void>(ENDPOINTS.delivery.location(id));
}
