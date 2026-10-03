const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function Money(amount: number): string {
  return nairaFormatter.format(amount).replace("NGN", "₦");
}

export function MoneyFromKobo(kobo: number): string {
  return Money(kobo / 100);
}

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-NG", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function fmtDate(date: string | Date): string {
  return dateFormatter.format(new Date(date));
}

export function fmtDateTime(date: string | Date): string {
  return dateTimeFormatter.format(new Date(date));
}
