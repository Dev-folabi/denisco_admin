"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addSlots,
  createType,
  deleteType,
  getAvailability,
  getBookings,
  getTypes,
  removeSlots,
  updateBookingStatus,
  updateType,
} from "./api";
import type { BookingStatus, TypeWrite } from "./types";

/** Query keys for consultations. */
export const consultationKeys = {
  all: ["admin", "consultations"] as const,
  types: ["admin", "consultations", "types"] as const,
  availability: ["admin", "consultations", "availability"] as const,
  bookings: (params: Record<string, unknown>) =>
    ["admin", "consultations", "bookings", params] as const,
};

/** Lists the consultation services. */
export function useConsultationTypes() {
  return useQuery({ queryKey: consultationKeys.types, queryFn: getTypes });
}

/** Loads the availability grid. */
export function useAvailability() {
  return useQuery({
    queryKey: consultationKeys.availability,
    queryFn: getAvailability,
  });
}

/** Lists bookings for the management table. */
export function useAdminBookings(params: { search?: string; status?: string } = {}) {
  return useQuery({
    queryKey: consultationKeys.bookings(params),
    queryFn: () => getBookings({ ...params, limit: 100 }),
  });
}

/** Invalidates everything a consultation change affects. */
function useInvalidate() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: consultationKeys.all });
}

/** Adds a consultation service. */
export function useCreateType() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: createType, onSuccess: invalidate });
}

/** Updates a consultation service. */
export function useUpdateType() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TypeWrite }) =>
      updateType(id, input),
    onSuccess: invalidate,
  });
}

/** Removes a consultation service. */
export function useDeleteType() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: deleteType, onSuccess: invalidate });
}

/** Opens dates or times for booking. */
export function useAddSlots() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: addSlots, onSuccess: invalidate });
}

/** Closes dates or times for booking. */
export function useRemoveSlots() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: removeSlots, onSuccess: invalidate });
}

/** Moves a booking through its lifecycle. */
export function useUpdateBookingStatus() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      updateBookingStatus(id, status),
    onSuccess: invalidate,
  });
}
