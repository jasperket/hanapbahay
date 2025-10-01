export const propertyTypeOptions = [
  { label: "House", value: 0 },
  { label: "Condo", value: 1 },
  { label: "Apartment", value: 2 },
  { label: "Bed Spacer", value: 3 },
  { label: "Dorm", value: 4 },
  { label: "Room", value: 5 },
] as const;

export type PropertyTypeValue = (typeof propertyTypeOptions)[number]["value"];

export const listingStatusOptions = [
  { label: "Draft", value: 0 },
  { label: "Active", value: 1 },
  { label: "Paused", value: 2 },
  { label: "Reserved", value: 3 },
  { label: "Rented", value: 4 },
  { label: "Removed", value: 5 },
] as const;

export type ListingStatusValue = (typeof listingStatusOptions)[number]["value"];

export interface PropertyMedia {
  id: number;
  url: string;
  order: number;
  isCover: boolean;
}

export interface Property {
  id: number;
  landlordId: string;
  landlordDisplayName: string;
  title: string;
  description?: string | null;
  propertyType: PropertyTypeValue;
  province: string;
  city: string;
  barangay?: string | null;
  zipCode?: string | null;
  targetLocation?: string | null;
  landmark?: string | null;
  monthlyPrice: number;
  maxPersons?: number | null;
  moveInDate?: string | null;
  status: ListingStatusValue;
  createdAt: string;
  amenityCodes: string[];
  media: PropertyMedia[];
}

export interface CreatePropertyPayload {
  title: string;
  description?: string;
  propertyType: PropertyTypeValue;
  province: string;
  city: string;
  barangay?: string;
  zipCode?: string;
  targetLocation?: string;
  landmark?: string;
  monthlyPrice: number;
  maxPersons?: number;
  moveInDate?: string;
  status: ListingStatusValue;
  amenityCodes: string[];
  coverImage: File;
  galleryImages: File[];
}

export interface UpdatePropertyPayload
  extends Omit<CreatePropertyPayload, "coverImage" | "galleryImages"> {
  newCoverImage?: File;
  newGalleryImages: File[];
  removeImageIds: number[];
}

export interface FormState {
  title: string;
  description: string;
  propertyType: string;
  province: string;
  city: string;
  barangay: string;
  zipCode: string;
  targetLocation: string;
  landmark: string;
  monthlyPrice: string;
  maxPersons: string;
  moveInDate: string;
  status: string;
  amenityCodes: string;
}
