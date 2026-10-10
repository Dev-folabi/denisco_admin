/** The provider-level state of a payment attempt. */
export type PaymentStatus =
  | "initialized"
  | "pending"
  | "successful"
  | "failed"
  | "abandoned"
  | "expired"
  | "refunded";

/** What an attempt is paying for. */
export type PaymentPurpose = "order" | "consultation";

/** A payment attempt as the API returns it. */
export interface Payment {
  id: string;
  reference: string;
  purpose: PaymentPurpose;
  /** Set on an order payment. */
  order_id?: string;
  order_number?: string;
  /** Set on a consultation payment. */
  booking_id?: string;
  booking_reference?: string;
  /** Absent on a guest consultation payment. */
  user_id?: string;
  customer_name?: string;
  email?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  method?: string;
  channel?: string;
  paid_at?: string;
  refunded_at?: string;
  created_at: string;
  updated_at: string;
}
