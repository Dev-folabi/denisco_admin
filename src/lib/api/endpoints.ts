export const ENDPOINTS = {
  auth: {
    login: "/auth/admin/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    me: "/auth/me",
    changePassword: "/auth/change-password",
    forgotPassword: "/auth/forgot-password",
  },
  dashboard: {
    overview: "/admin/dashboard/overview",
  },
  products: {
    list: "/admin/products",
    detail: (id: string) => `/admin/products/${id}`,
    create: "/admin/products",
    update: (id: string) => `/admin/products/${id}`,
    delete: (id: string) => `/admin/products/${id}`,
    uploadSignature: "/admin/products/upload-signature",
  },
  inventory: {
    list: "/admin/inventory",
    adjustments: "/admin/inventory/adjustments",
    movements: "/admin/inventory/movements",
  },
  orders: {
    list: "/admin/orders",
    detail: (id: string) => `/admin/orders/${id}`,
    updateStatus: (id: string) => `/admin/orders/${id}/status`,
  },
  customers: {
    list: "/admin/customers",
    detail: (id: string) => `/admin/customers/${id}`,
  },
  payments: {
    list: "/admin/payments",
    detail: (id: string) => `/admin/payments/${id}`,
    refund: (id: string) => `/admin/payments/${id}/refund`,
  },
  consultations: {
    types: {
      list: "/admin/consultations/types",
      create: "/admin/consultations/types",
      update: (id: string) => `/admin/consultations/types/${id}`,
      delete: (id: string) => `/admin/consultations/types/${id}`,
    },
    bookings: {
      list: "/admin/consultations/bookings",
      detail: (id: string) => `/admin/consultations/bookings/${id}`,
      updateStatus: (id: string) => `/admin/consultations/bookings/${id}/status`,
    },
    slots: {
      list: "/admin/consultations/slots",
      create: "/admin/consultations/slots",
      delete: (id: string) => `/admin/consultations/slots/${id}`,
    },
  },
  auditLogs: {
    list: "/admin/audit-logs",
  },
} as const;
