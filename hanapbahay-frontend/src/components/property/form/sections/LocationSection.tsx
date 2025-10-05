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

export function LocationSection({
  formState,
  onChange,
  disabled,
  isRequired,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <InputField
        id="province"
        label="Province"
        value={formState.province}
        onChange={onChange}
        disabled={disabled}
        required={isRequired("province")}
      />
      <InputField
        id="city"
        label="City"
        value={formState.city}
        onChange={onChange}
        disabled={disabled}
        required={isRequired("city")}
      />
      <InputField
        id="barangay"
        label="Barangay"
        value={formState.barangay}
        onChange={onChange}
        disabled={disabled}
      />
      <InputField
        id="zipCode"
        label="ZIP Code"
        value={formState.zipCode}
        onChange={onChange}
        disabled={disabled}
      />
      <InputField
        id="targetLocation"
        label="Street Address"
        value={formState.targetLocation}
        onChange={onChange}
        disabled={disabled}
      />
      <InputField
        id="landmark"
        label="Landmark"
        value={formState.landmark}
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
        value={value}
        onChange={onChange(id)}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}
