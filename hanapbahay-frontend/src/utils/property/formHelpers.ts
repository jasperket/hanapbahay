import {
  listingStatusOptions,
  propertyTypeOptions,
  type FormState,
  type Property,
} from "@/types/property";

export const buildFormStateFromProperty = (property: Property): FormState => ({
  title: property.title,
  description: property.description ?? "",
  propertyType: String(property.propertyType),
  province: property.province,
  city: property.city,
  barangay: property.barangay ?? "",
  zipCode: property.zipCode ?? "",
  targetLocation: property.targetLocation ?? "",
  landmark: property.landmark ?? "",
  monthlyPrice: property.monthlyPrice.toString(),
  maxPersons:
    typeof property.maxPersons === "number"
      ? property.maxPersons.toString()
      : "",
  moveInDate: property.moveInDate ? property.moveInDate.slice(0, 10) : "",
  status: String(property.status),
  amenityCodes: property.amenityCodes.join(", "),
});

export const initialFormState: FormState = {
  title: "",
  description: "",
  propertyType: String(propertyTypeOptions[0]?.value ?? 0),
  province: "",
  city: "",
  barangay: "",
  zipCode: "",
  targetLocation: "",
  landmark: "",
  monthlyPrice: "",
  maxPersons: "",
  moveInDate: "",
  status: String(listingStatusOptions[0]?.value ?? 0),
  amenityCodes: "",
};
