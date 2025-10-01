// utils/validatePropertyForm.ts
import type { FormState } from "@/types/property";

export function validatePropertyForm(form: FormState): string | null {
  // Title required
  if (!form.title.trim()) {
    return "Title is required.";
  }

  // Province & City required
  if (!form.province.trim() || !form.city.trim()) {
    return "Province and city are required.";
  }

  // Monthly price must be > 0
  const monthlyPrice = Number(form.monthlyPrice);
  if (!Number.isFinite(monthlyPrice) || monthlyPrice <= 0) {
    return "Monthly price must be greater than zero.";
  }

  // Max persons must be positive number (if provided)
  if (form.maxPersons.trim()) {
    const parsed = Number.parseInt(form.maxPersons, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return "Max persons must be a positive number.";
    }
  }

  // Optional: future date validation for moveInDate
  if (form.moveInDate) {
    const moveIn = new Date(form.moveInDate);
    if (isNaN(moveIn.getTime())) {
      return "Move-in date is invalid.";
    }
  }

  return null; // ✅ valid
}
