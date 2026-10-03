export const ADMIN = {
  name: "DENISCO Admin",
  subtitle: "Management Console",
  webUrl: process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000",
} as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Products", href: "/products", icon: "Package" },
  { label: "Orders", href: "/orders", icon: "ShoppingCart" },
  { label: "Customers", href: "/customers", icon: "Users" },
  { label: "Transactions", href: "/payments", icon: "CreditCard" },
  { label: "Consultations", href: "/consultations", icon: "CalendarCheck" },
] as const;

export const NAV_SECONDARY = [
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "dispatched",
  "completed",
  "cancelled",
] as const;

export const PAYMENT_STATUSES = [
  "initialized",
  "pending",
  "successful",
  "failed",
  "abandoned",
  "expired",
  "refunded",
] as const;

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export const PRODUCT_CATEGORIES = [
  { value: "poultry", label: "Poultry" },
  { value: "livestock", label: "Livestock" },
  { value: "piggery", label: "Piggery" },
  { value: "snail", label: "Snail" },
  { value: "crops", label: "Crops" },
] as const;
