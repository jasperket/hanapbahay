import { api } from "@/services/api";
import type { PagedResult } from "@/types/common";
import type {
  AmenityOption,
  CreatePropertyPayload,
  Property,
  PropertyFilterParams,
  UpdatePropertyPayload,
} from "@/types/property";
import qs from "qs";

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
  if (payload.streetAddress) {
    formData.append("streetAddress", payload.streetAddress);
  }
  if (payload.landmark) {
    formData.append("Landmark", payload.landmark);
  }
  formData.append("MonthlyPrice", payload.monthlyPrice.toString());
  if (
    typeof payload.maxPersons === "number" &&
    !Number.isNaN(payload.maxPersons)
  ) {
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

const getAmenities = async () => {
  const { data } = await api.get<AmenityOption[]>("Property/amenities");
  console.log(data);
  return data;
};

const getProperties = async () => {
  const { data } = await api.get<Property[]>("Property");
  return data;
};

export const getFilteredProperties = async (
  params: PropertyFilterParams,
): Promise<PagedResult<Property>> => {
  const { data } = await api.get<PagedResult<Property>>("/property/filter", {
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });
  console.log(data);
  return data;
};

const getLandlordProperties = async () => {
  const { data } = await api.get<Property[]>("Property/mine");
  return data;
};

const getPropertyById = async (propertyId: number) => {
  const { data } = await api.get<Property>(`Property/${propertyId}`);
  return data;
};

const updateProperty = async (
  propertyId: number,
  payload: UpdatePropertyPayload,
) => {
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
  if (payload.streetAddress) {
    formData.append("streetAddress", payload.streetAddress);
  }
  if (payload.landmark) {
    formData.append("Landmark", payload.landmark);
  }
  formData.append("MonthlyPrice", payload.monthlyPrice.toString());
  if (
    typeof payload.maxPersons === "number" &&
    !Number.isNaN(payload.maxPersons)
  ) {
    formData.append("MaxPersons", payload.maxPersons.toString());
  }
  if (payload.moveInDate) {
    formData.append("MoveInDate", payload.moveInDate);
  }
  formData.append("Status", String(payload.status));
  payload.amenityCodes.forEach((code) => {
    formData.append("AmenityCodes", code);
  });

  if (payload.newCoverImage) {
    formData.append("NewImages", payload.newCoverImage);
  }
  payload.newGalleryImages.forEach((image) => {
    formData.append("NewImages", image);
  });

  payload.removeImageIds.forEach((id) => {
    formData.append("RemoveImageIds", id.toString());
  });

  const { data } = await api.put<Property>(`Property/${propertyId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

const deleteProperty = async (propertyId: number) => {
  await api.delete(`Property/${propertyId}`);
};

export {
  createProperty,
  getAmenities,
  getProperties,
  getLandlordProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
