import { api } from "@/services/api";
import type { CreatePropertyPayload, Property } from "@/types/property";

const createProperty = async (payload: CreatePropertyPayload) => {
  const formData = new FormData();

  formData.append("Title", payload.title);
  if (payload.description) {
    formData.append("Description", payload.description);
  }
  formData.append("PropertyType", String(payload.propertyType));
  formData.append("Province", payload.province);
  formData.append("City", payload.city);
  if (payload.barangay) {
    formData.append("Barangay", payload.barangay);
  }
  if (payload.zipCode) {
    formData.append("ZipCode", payload.zipCode);
  }
  if (payload.targetLocation) {
    formData.append("TargetLocation", payload.targetLocation);
  }
  if (payload.landmark) {
    formData.append("Landmark", payload.landmark);
  }
  formData.append("MonthlyPrice", payload.monthlyPrice.toString());
  if (typeof payload.maxPersons === "number" && !Number.isNaN(payload.maxPersons)) {
    formData.append("MaxPersons", payload.maxPersons.toString());
  }
  if (payload.moveInDate) {
    formData.append("MoveInDate", payload.moveInDate);
  }
  formData.append("Status", String(payload.status));
  payload.amenityCodes.forEach((code) => {
    formData.append("AmenityCodes", code);
  });

  formData.append("Images", payload.coverImage);
  payload.galleryImages.forEach((image) => {
    formData.append("Images", image);
  });

  const { data } = await api.post<Property>("Property", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export { createProperty };
