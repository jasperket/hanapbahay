import { type ChangeEvent } from "react";
import { AmenitiesSelector } from "../components/AmenitiesSelector";
import type {
  AmenityOption,
  FormState,
  ListingStatusValue,
} from "@/types/property";

interface Props {
  formState: FormState;
  onChange: (
    field: keyof FormState,
  ) => (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  disabled: boolean;
  statusOptions?: readonly { label: string; value: ListingStatusValue }[];
  amenityOptions: AmenityOption[];
  onAmenityAdd: (code: string) => void;
  onAmenityRemove: (code: string) => void;
}

export function MetaSection({
  formState,
  onChange,
  disabled,
  statusOptions,
  amenityOptions,
  onAmenityAdd,
  onAmenityRemove,
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

      <div className="space-y-2 md:col-span-2">
        <label htmlFor="amenities" className="text-sm font-medium">
          Amenities
        </label>
        <AmenitiesSelector
          options={amenityOptions}
          selectedCodes={formState.amenityCodes}
          onAdd={onAmenityAdd}
          onRemove={onAmenityRemove}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
