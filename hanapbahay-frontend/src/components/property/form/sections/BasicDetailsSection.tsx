import { Input } from "@/components/ui/input";
import type { FormState, PropertyTypeValue } from "@/types/property";

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
  propertyTypeOptions?: readonly { label: string; value: PropertyTypeValue }[];
  isRequired: (field: keyof FormState) => boolean;
}

export function BasicDetailsSection({
  formState,
  onChange,
  disabled,
  propertyTypeOptions,
  isRequired,
}: Props) {
  const titleRequired = isRequired("title");
  const propertyTypeRequired = isRequired("propertyType");
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
          {titleRequired && (
            <span aria-hidden="true" className="text-destructive ml-1">
              *
            </span>
          )}
          {titleRequired && <span className="sr-only">required</span>}
        </label>
        <Input
          id="title"
          value={formState.title}
          onChange={onChange("title")}
          placeholder="Cozy 2-bedroom apartment"
          required
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="propertyType" className="text-sm font-medium">
          Property Type
          {propertyTypeRequired && (
            <span aria-hidden="true" className="text-destructive ml-1">
              *
            </span>
          )}
          {propertyTypeRequired && <span className="sr-only">required</span>}
        </label>
        <select
          id="propertyType"
          value={formState.propertyType}
          onChange={onChange("propertyType")}
          disabled={disabled}
          required={propertyTypeRequired}
          className="border-input bg-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          {propertyTypeOptions &&
            propertyTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={formState.description}
          onChange={onChange("description")}
          rows={4}
          disabled={disabled}
          placeholder="Describe the property..."
          className="border-input bg-background focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2"
        />
      </div>
    </div>
  );
}
