import { apiClient, type ApiMeta } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
  Availability,
  Booking,
  BookingStatus,
  ConsultationType,
  TypeWrite,
} from "./types";

/** Lists every consultation service, inactive ones included. */
export async function getTypes(): Promise<ConsultationType[]> {
  return apiClient.get<ConsultationType[]>(ENDPOINTS.consultations.types.list);
}

/** Adds a consultation service. */
export async function createType(input: TypeWrite): Promise<ConsultationType> {
  return apiClient.post<ConsultationType>(ENDPOINTS.consultations.types.create, input);
}

/** Applies a partial change to a consultation service. */
export async function updateType(
  id: string,
  input: TypeWrite,
): Promise<ConsultationType> {
  return apiClient.patch<ConsultationType>(ENDPOINTS.consultations.types.update(id), input);
}

/** Removes a consultation service that has no bookings. */
export async function deleteType(id: string): Promise<void> {
  await apiClient.delete<null>(ENDPOINTS.consultations.types.delete(id));
}

/** Loads the availability grid. */
export async function getAvailability(): Promise<Availability> {
  return apiClient.get<Availability>(ENDPOINTS.consultations.slots.list);
}

/**
 * Opens dates or times for booking.
 *
 * Omitting times reuses the ones already offered, which is what selecting
 * dates on the calendar means; omitting dates applies a new time to every
 * date already open.
 */
export async function addSlots(input: {
  dates?: string[];
  times?: string[];
}): Promise<Availability> {
  return apiClient.post<Availability>(ENDPOINTS.consultations.slots.create, input);
}

/** Closes dates or times for booking. */
export async function removeSlots(input: {
  dates?: string[];
  times?: string[];
}): Promise<Availability> {
  return apiClient.post<Availability>(ENDPOINTS.consultations.slots.remove, input);
}

/** Lists bookings for the dashboard. */
export async function getBookings(
  params: { search?: string; status?: string; limit?: number } = {},
): Promise<{ data: Booking[]; meta?: ApiMeta }> {
  return apiClient.getPage<Booking[]>(ENDPOINTS.consultations.bookings.list, { params });
}

/** Moves a booking through its lifecycle. */
export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<Booking> {
  return apiClient.patch<Booking>(
    ENDPOINTS.consultations.bookings.updateStatus(id),
    { status },
  );
}
