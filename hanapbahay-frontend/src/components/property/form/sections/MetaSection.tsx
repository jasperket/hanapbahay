import { useMemo, useState, type ChangeEvent } from "react";
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

interface AmenitiesSelectorProps {
  options: AmenityOption[];
  selectedCodes: string[];
  onAdd: (code: string) => void;
  onRemove: (code: string) => void;
  disabled: boolean;
}

function AmenitiesSelector({
  options,
  selectedCodes,
  onAdd,
  onRemove,
  disabled,
}: AmenitiesSelectorProps) {
  const [pendingCode, setPendingCode] = useState("");

  const availableOptions = useMemo(() => {
    const selected = new Set(selectedCodes);
    return options.filter((option) => !selected.has(option.code));
  }, [options, selectedCodes]);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextCode = event.target.value;
    if (!nextCode) return;

    onAdd(nextCode);
    setPendingCode("");
  };

  return (
    <div className="space-y-3">
      <select
        id="amenities"
        value={pendingCode}
        onChange={handleSelectChange}
        disabled={disabled || availableOptions.length === 0}
        className="border-input bg-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <option value="">{availableOptions.length ? "Select an amenity" : "All amenities added"}</option>
        {availableOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label || option.code}
          </option>
        ))}
      </select>

      <div className="flex flex-wrap gap-2">
        {selectedCodes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No amenities selected yet.</p>
        ) : (
          selectedCodes.map((code) => {
            const label = options.find((option) => option.code === code)?.label || code;
            return (
              <span
                key={code}
                className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm"
              >
                {label}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => onRemove(code)}
                    className="text-primary/80 hover:text-primary focus-visible:ring-ring rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    <span aria-hidden="true">&times;</span>
                    <span className="sr-only">Remove {label}</span>
                  </button>
                )}
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}
