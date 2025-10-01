import { useState } from "react";
import type { ChangeEvent } from "react";
import type { FormState, Property } from "@/types/property";
import {
  buildFormStateFromProperty,
  initialFormState,
} from "@/utils/property/formHelpers";

export function usePropertyFormState(
  mode: "create" | "edit",
  initialProperty?: Property | null,
) {
  const [formState, setFormState] = useState<FormState>(
    mode === "edit" && initialProperty
      ? buildFormStateFromProperty(initialProperty)
      : initialFormState,
  );

  const handleInputChange =
    (field: keyof FormState) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const value = event.target.value;
      setFormState((prev) => ({ ...prev, [field]: value }));
    };

  return { formState, setFormState, handleInputChange };
}
