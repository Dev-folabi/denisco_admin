/** A consultation service the farm offers. Prices are integers in kobo. */
export interface ConsultationType {
  id: string;
  name: string;
  description: string;
  /** The label the prototype shows, e.g. "60 mins". */
  duration: string;
  duration_minutes: number;
  price: number;
  currency: string;
  active: boolean;
  position: number;
}

/** The state of a booking's consultation fee. */
export type BookingPaymentStatus =
  | "not_required"
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

/** One offered time in the availability grid. */
export interface Slot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

/** The availability grid the editor manages. */
export interface Availability {
  dates: string[];
  times: string[];
  slots: Slot[];
}

/** Booking lifecycle, matching the status dropdown. */
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

/** A booked consultation. */
export interface Booking {
  id: string;
  reference: string;
  user_id?: string;
  type_id: string;
  type_name: string;
  type_price: number;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: BookingStatus;
  payment_status: BookingPaymentStatus;
  payment_ref?: string;
  paid_at?: string;
  /** True while the fee can still be settled. */
  payable: boolean;
  created_at: string;
}

/** The fields the consultation-type form writes. */
export interface TypeWrite {
  name?: string;
  description?: string;
  duration_minutes?: number;
  price?: number;
  active?: boolean;
}
