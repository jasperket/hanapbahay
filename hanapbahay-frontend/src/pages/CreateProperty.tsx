import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProperty } from "@/services/propertyClient";
import {
  listingStatusOptions,
  propertyTypeOptions,
  type CreatePropertyPayload,
} from "@/types/property";

interface FormState {
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

const initialFormState: FormState = {
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

const maxGalleryImages = 10;

const extractErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    if (data) {
      const errors = data.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        return errors.join(" ");
      }
      if (errors && typeof errors === "object") {
        const collected = Object.values(errors)
          .flat()
          .filter((value): value is string => typeof value === "string");
        if (collected.length > 0) {
          return collected.join(" ");
        }
      }
      if (typeof data.message === "string") {
        return data.message;
      }
      if (typeof data.title === "string") {
        return data.title;
      }
    }
    return error.response?.statusText ?? "Request failed.";
  }

  return "Unexpected error occurred.";
};

const CreateProperty = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectableStatuses = useMemo(
    () => listingStatusOptions.filter((option) => option.value === 0 || option.value === 1),
    [],
  );

  useEffect(() => {
    if (!coverImage) {
      setCoverPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(coverImage);
    setCoverPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [coverImage]);

  const handleInputChange = (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setFormState((previous) => ({
        ...previous,
        [field]: value,
      }));
    };

  const handleCoverDrop = (acceptedFiles: File[]) => {
    const [file] = acceptedFiles;
    if (file) {
      setCoverImage(file);
    }
  };

  const handleGalleryDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    setGalleryImages((previous) => {
      const fileMap = new Map<string, File>();
      previous.forEach((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        fileMap.set(key, file);
      });

      acceptedFiles.forEach((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (!fileMap.has(key) && fileMap.size < maxGalleryImages) {
          fileMap.set(key, file);
        }
      });

      return Array.from(fileMap.values());
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((previous) => previous.filter((_, position) => position !== index));
  };

  const handleResetForm = () => {
    setFormState(initialFormState);
    setCoverImage(null);
    setGalleryImages([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!formState.province.trim() || !formState.city.trim()) {
      toast.error("Province and city are required.");
      return;
    }

    if (!coverImage) {
      toast.error("Please upload a cover image.");
      return;
    }

    const monthlyPrice = Number.parseFloat(formState.monthlyPrice);
    if (!Number.isFinite(monthlyPrice) || monthlyPrice <= 0) {
      toast.error("Monthly price must be greater than zero.");
      return;
    }

    let maxPersonsValue: number | undefined;
    if (formState.maxPersons.trim()) {
      const parsed = Number.parseInt(formState.maxPersons, 10);
      if (Number.isNaN(parsed) || parsed <= 0) {
        toast.error("Max persons must be a positive number.");
        return;
      }
      maxPersonsValue = parsed;
    }

    const amenityCodes = formState.amenityCodes
      .split(",")
      .map((code) => code.trim())
      .filter((code) => code.length > 0);

    const payload: CreatePropertyPayload = {
      title: formState.title.trim(),
      description: formState.description.trim() || undefined,
      propertyType: Number.parseInt(formState.propertyType, 10) as CreatePropertyPayload["propertyType"],
      province: formState.province.trim(),
      city: formState.city.trim(),
      barangay: formState.barangay.trim() || undefined,
      zipCode: formState.zipCode.trim() || undefined,
      targetLocation: formState.targetLocation.trim() || undefined,
      landmark: formState.landmark.trim() || undefined,
      monthlyPrice,
      maxPersons: maxPersonsValue,
      moveInDate: formState.moveInDate || undefined,
      status: Number.parseInt(formState.status, 10) as CreatePropertyPayload["status"],
      amenityCodes,
      coverImage,
      galleryImages,
    };

    setIsSubmitting(true);
    try {
      await createProperty(payload);
      toast.success("Property created successfully.");
      handleResetForm();
      navigate("/account");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar01 />
      <main className="bg-muted/40">
        <section className="container mx-auto max-w-4xl px-4 py-10">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold">Create a property listing</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Provide the property details, upload a cover image, and include any additional gallery images.
            </p>
          </header>
          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="title">
                  Title
                </label>
                <Input
                  id="title"
                  value={formState.title}
                  onChange={handleInputChange("title")}
                  placeholder="Cozy 2-bedroom apartment"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="propertyType">
                  Property type
                </label>
                <select
                  id="propertyType"
                  value={formState.propertyType}
                  onChange={handleInputChange("propertyType")}
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {propertyTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formState.description}
                  onChange={handleInputChange("description")}
                  rows={4}
                  disabled={isSubmitting}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Describe the property, nearby amenities, and key highlights."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="province">
                  Province
                </label>
                <Input
                  id="province"
                  value={formState.province}
                  onChange={handleInputChange("province")}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="city">
                  City
                </label>
                <Input
                  id="city"
                  value={formState.city}
                  onChange={handleInputChange("city")}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="barangay">
                  Barangay
                </label>
                <Input
                  id="barangay"
                  value={formState.barangay}
                  onChange={handleInputChange("barangay")}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="zipCode">
                  ZIP code
                </label>
                <Input
                  id="zipCode"
                  value={formState.zipCode}
                  onChange={handleInputChange("zipCode")}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="targetLocation">
                  Target location
                </label>
                <Input
                  id="targetLocation"
                  value={formState.targetLocation}
                  onChange={handleInputChange("targetLocation")}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="landmark">
                  Landmark
                </label>
                <Input
                  id="landmark"
                  value={formState.landmark}
                  onChange={handleInputChange("landmark")}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="monthlyPrice">
                  Monthly price (₱)
                </label>
                <Input
                  id="monthlyPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.monthlyPrice}
                  onChange={handleInputChange("monthlyPrice")}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="maxPersons">
                  Max persons
                </label>
                <Input
                  id="maxPersons"
                  type="number"
                  min="1"
                  step="1"
                  value={formState.maxPersons}
                  onChange={handleInputChange("maxPersons")}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="moveInDate">
                  Move-in date
                </label>
                <Input
                  id="moveInDate"
                  type="date"
                  value={formState.moveInDate}
                  onChange={handleInputChange("moveInDate")}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="status">
                  Listing status
                </label>
                <select
                  id="status"
                  value={formState.status}
                  onChange={handleInputChange("status")}
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {selectableStatuses.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="amenityCodes">
                  Amenity codes
                </label>
                <Input
                  id="amenityCodes"
                  value={formState.amenityCodes}
                  onChange={handleInputChange("amenityCodes")}
                  placeholder="Comma-separated codes (e.g. WIFI,PARKING)"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Cover image</p>
                  <p className="text-muted-foreground text-xs">
                    Upload a single cover image. This will be the primary photo for the listing.
                  </p>
                </div>
                {coverImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCoverImage(null)}
                    disabled={isSubmitting}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <Dropzone
                accept={{ "image/*": [] }}
                maxFiles={1}
                onDrop={handleCoverDrop}
                src={coverImage ? [coverImage] : undefined}
                disabled={isSubmitting}
              >
                {coverImage && coverPreview ? (
                  <div className="flex w-full flex-col items-center gap-3">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="h-48 w-full rounded-md object-cover"
                    />
                    <p className="text-muted-foreground text-sm">
                      Drag and drop or click to replace the cover image.
                    </p>
                  </div>
                ) : (
                  <DropzoneEmptyState className="text-center" />
                )}
              </Dropzone>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Gallery images</p>
                  <p className="text-muted-foreground text-xs">
                    Add up to {maxGalleryImages} additional images to showcase the property.
                  </p>
                </div>
                {galleryImages.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setGalleryImages([])}
                    disabled={isSubmitting}
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <Dropzone
                accept={{ "image/*": [] }}
                maxFiles={maxGalleryImages}
                multiple
                onDrop={handleGalleryDrop}
                src={galleryImages.length > 0 ? galleryImages : undefined}
                disabled={isSubmitting}
              >
                <>
                  <DropzoneContent className="text-center" />
                  <DropzoneEmptyState className="text-center" />
                </>
              </Dropzone>
              {galleryImages.length > 0 && (
                <ul className="space-y-2">
                  {galleryImages.map((file, index) => (
                    <li
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                    >
                      <span className="mr-3 truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGalleryImage(index)}
                        disabled={isSubmitting}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleResetForm}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create property"}
              </Button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

export default CreateProperty;
