import type { Booking } from "@/features/consultations/types";

/** One bar on the dashboard's revenue chart. */
export interface SalesPoint {
  date: string;
  /** Short weekday label, e.g. "Mon". */
  label: string;
  revenue: number;
}

/** The compact order row in the dashboard's activity list. */
export interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
}

/** The dashboard payload. Amounts are integers in kobo. */
export interface Overview {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  pending_orders: number;
  consultation_bookings: number;
  currency: string;
  recent_orders: RecentOrder[];
  recent_bookings: Booking[];
  sales: SalesPoint[];
}
