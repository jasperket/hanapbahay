// hooks/useSubmitProperty.ts
import { useState } from "react";
import { toast } from "sonner";
import { createProperty, updateProperty } from "@/services/propertyClient";
import type {
  FormState,
  CreatePropertyPayload,
  UpdatePropertyPayload,
  PropertyTypeValue,
  ListingStatusValue,
} from "@/types/property";
import { validatePropertyForm } from "@/utils/property/validatePropertyForm";
import { extractErrorMessage } from "@/utils/property/extractErrorMessage";

export function useSubmitProperty(
  mode: "create" | "edit",
  propertyId?: number,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    formState: FormState,
    coverImage: File | null,
    galleryImages: File[],
    removedImageIds: number[],
    onSuccess: () => void,
  ) {
    const errorMsg = validatePropertyForm(formState);
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "edit") {
        if (!propertyId) throw new Error("Missing propertyId");

        const payload: UpdatePropertyPayload = {
          ...mapFormToPayload(formState),
          newCoverImage: coverImage ?? undefined,
          newGalleryImages: galleryImages,
          removeImageIds: removedImageIds,
        };

        await updateProperty(propertyId, payload);
        toast.success("Property updated successfully.");
      } else {
        if (!coverImage) {
          toast.error("Please upload a cover image.");
          return;
        }

        const payload: CreatePropertyPayload = {
          ...mapFormToPayload(formState),
          coverImage,
          galleryImages,
        };

        await createProperty(payload);
        toast.success("Property created successfully.");
      }

      onSuccess();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, handleSubmit };
}

function mapFormToPayload(form: FormState) {
  return {
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    propertyType: Number(form.propertyType) as PropertyTypeValue,
    province: form.province.trim(),
    city: form.city.trim(),
    barangay: form.barangay.trim() || undefined,
    zipCode: form.zipCode.trim() || undefined,
    streetAddress: form.streetAddress.trim() || undefined,
    landmark: form.landmark.trim() || undefined,
    monthlyPrice: Number(form.monthlyPrice),
    maxPersons: form.maxPersons ? Number(form.maxPersons) : undefined,
    moveInDate: form.moveInDate || undefined,
    status: Number(form.status) as ListingStatusValue,
    amenityCodes: form.amenityCodes.map((code) => code.trim()).filter(Boolean),
  };
}
