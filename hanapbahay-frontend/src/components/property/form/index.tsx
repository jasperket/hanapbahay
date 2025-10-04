import { useEffect, useState, type FormEvent } from "react";
import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getAmenities } from "@/services/propertyClient";
import { usePropertyFormState } from "./hooks/usePropertyFormState";
import { usePropertyImages } from "./hooks/usePropertyImages";
import { useSubmitProperty } from "./hooks/useSubmitProperty";

import { BasicDetailsSection } from "./sections/BasicDetailsSection";
import { LocationSection } from "./sections/LocationSection";
import { PricingSection } from "./sections/PricingSection";
import { MetaSection } from "./sections/MetaSection";
import { ImageUploader } from "./sections/ImageUploader";
import { GalleryUploader } from "./sections/GalleryUploader";
import { FormActions } from "./sections/FormActions";

import type { AmenityOption, Property } from "@/types/property";
import { propertyTypeOptions, listingStatusOptions } from "@/types/property";

interface PropertyFormProps {
  mode?: "create" | "edit";
  propertyId?: number;
  initialProperty?: Property | null;
}

export function PropertyForm({
  mode = "create",
  propertyId,
  initialProperty,
}: PropertyFormProps) {
  const navigate = useNavigate();

  const { formState, setFormState, handleInputChange } = usePropertyFormState(
    mode,
    initialProperty,
  );

  const [amenityOptions, setAmenityOptions] = useState<AmenityOption[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadAmenities = async () => {
      try {
        const options = await getAmenities();
        if (isMounted) {
          setAmenityOptions(options);
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Failed to load amenities. Please try again.");
        }

        if (import.meta.env.DEV) {
          console.error("[PropertyForm] Unable to fetch amenities", error);
        }
      }
    };

    loadAmenities();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddAmenity = (code: string) => {
    setFormState((prev) => {
      if (prev.amenityCodes.includes(code)) {
        return prev;
      }

      return { ...prev, amenityCodes: [...prev.amenityCodes, code] };
    });
  };

  const handleRemoveAmenity = (code: string) => {
    setFormState((prev) => ({
      ...prev,
      amenityCodes: prev.amenityCodes.filter((selected) => selected !== code),
    }));
  };

  const {
    coverImage,
    coverPreview,
    galleryImages,
    existingCover,
    existingGallery,
    removedImageIds,
    setCoverImage,
    setGalleryImages,
    setExistingCover,
    setExistingGallery,
    setRemovedImageIds,
  } = usePropertyImages(
    initialProperty?.media.find((m) => m.isCover) ?? null,
    initialProperty?.media.filter((m) => !m.isCover) ?? [],
  );

  const { isSubmitting, handleSubmit } = useSubmitProperty(mode, propertyId);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(formState, coverImage, galleryImages, removedImageIds, () =>
      navigate("/properties"),
    );
  };

  return (
    <>
      <Navbar01 />
      <main className="bg-muted/40">
        <section className="container mx-auto max-w-4xl px-4 py-10">
          <form onSubmit={onSubmit} className="space-y-10">
            <BasicDetailsSection
              formState={formState}
              onChange={handleInputChange}
              disabled={isSubmitting}
              propertyTypeOptions={propertyTypeOptions}
            />

            <LocationSection
              formState={formState}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />

            <PricingSection
              formState={formState}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />

            <MetaSection
              formState={formState}
              onChange={handleInputChange}
              disabled={isSubmitting}
              statusOptions={listingStatusOptions}
              amenityOptions={amenityOptions}
              onAmenityAdd={handleAddAmenity}
              onAmenityRemove={handleRemoveAmenity}
            />

            <ImageUploader
              coverImage={coverImage}
              coverPreview={coverPreview}
              existingCover={existingCover}
              setCoverImage={setCoverImage}
              setExistingCover={setExistingCover}
              disabled={isSubmitting}
            />

            <GalleryUploader
              galleryImages={galleryImages}
              existingGallery={existingGallery}
              setGalleryImages={setGalleryImages}
              setExistingGallery={setExistingGallery}
              setRemovedImageIds={setRemovedImageIds}
              disabled={isSubmitting}
            />

            <FormActions isSubmitting={isSubmitting} mode={mode} />
          </form>
        </section>
      </main>
    </>
  );
}

export function CreateProperty() {
  return <PropertyForm mode="create" />;
}
