import { Input } from "@/components/ui/input";
import type { FormState, ListingStatusValue } from "@/types/property";

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
  statusOptions?: readonly { label: string; value: ListingStatusValue }[];
}

export function MetaSection({
  formState,
  onChange,
  disabled,
  statusOptions,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">
          Listing Status
        </label>
        <select
          id="status"
          value={formState.status}
          onChange={onChange("status")}
          disabled={disabled}
          className="border-input bg-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          {statusOptions &&
            statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="amenityCodes" className="text-sm font-medium">
          Amenity Codes
        </label>
        <Input
          id="amenityCodes"
          value={formState.amenityCodes}
          onChange={onChange("amenityCodes")}
          placeholder="Comma-separated codes (e.g. WIFI,PARKING)"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
