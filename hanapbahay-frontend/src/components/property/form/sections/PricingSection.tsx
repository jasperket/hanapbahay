import { Input } from "@/components/ui/input";
import type { FormState } from "@/types/property";

interface Props {
  formState: FormState;
  onChange: (
    field: keyof FormState,
  ) => (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  disabled: boolean;
  isRequired: (field: keyof FormState) => boolean;
}

export function PricingSection({ formState, onChange, disabled, isRequired }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <InputField
        id="monthlyPrice"
        label="Monthly Price (₱)"
        type="number"
        value={formState.monthlyPrice}
        onChange={onChange}
        disabled={disabled}
        required={isRequired("monthlyPrice")}
      />
      <InputField
        id="maxPersons"
        label="Max Persons"
        type="number"
        value={formState.maxPersons}
        onChange={onChange}
        disabled={disabled}
      />
      <InputField
        id="moveInDate"
        label="Move-in Date"
        type="date"
        value={formState.moveInDate}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

function InputField({
  id,
  label,
  value,
  onChange,
  disabled,
  required,
  type = "text",
}: {
  id: keyof FormState;
  label: string;
  value: string;
  onChange: (
    field: keyof FormState,
  ) => (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  disabled: boolean;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && (
          <span aria-hidden="true" className="text-destructive ml-1">
            *
          </span>
        )}
        {required && <span className="sr-only">required</span>}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange(id)}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}
