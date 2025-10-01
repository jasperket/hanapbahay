// utils/formatters.ts
export const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2,
});

export const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
