import type { Booking } from "@/features/consultations/types";
import type { Order } from "@/features/orders/types";

/** A customer account as the admin API returns it. */
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "suspended";
  email_verified: boolean;
  created_at: string;
  last_login_at?: string;
}

/** A customer's profile with their trading history. */
export interface CustomerDetail {
  customer?: Customer;
  orders: Order[];
  bookings: Booking[];
  total_orders: number;
  total_spent: number;
}
