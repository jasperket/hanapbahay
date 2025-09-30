import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProperty, updateProperty } from "@/services/propertyClient";
import {
  listingStatusOptions,
  propertyTypeOptions,
  type CreatePropertyPayload,
  type Property,
  type PropertyMedia,
  type UpdatePropertyPayload,
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

type PropertyFormMode = "create" | "edit";

interface PropertyFormProps {
  mode?: PropertyFormMode;
  propertyId?: number;
  initialProperty?: Property | null;
}

const buildFormStateFromProperty = (property: Property): FormState => ({
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

const PropertyForm = ({
  mode = "create",
  propertyId,
  initialProperty,
}: PropertyFormProps) => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [existingCover, setExistingCover] = useState<PropertyMedia | null>(
    null,
  );
  const [existingGallery, setExistingGallery] = useState<PropertyMedia[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

  const initialPropertyRef = useRef<Property | null>(null);
  const originalCoverRef = useRef<PropertyMedia | null>(null);
  const originalCoverRemovedRef = useRef(false);

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

  useEffect(() => {
    if (mode !== "edit" || !initialProperty) {
      return;
    }

    initialPropertyRef.current = initialProperty;
    setFormState(buildFormStateFromProperty(initialProperty));

    const cover = initialProperty.media.find((media) => media.isCover) ?? null;
    setExistingCover(cover);
    originalCoverRef.current = cover;
    originalCoverRemovedRef.current = false;

    const gallery = initialProperty.media.filter((media) => !media.isCover);
    setExistingGallery(gallery);

    setCoverImage(null);
    setCoverPreview(null);
    setGalleryImages([]);
    setRemovedImageIds([]);
  }, [mode, initialProperty]);

  const addRemovedImageId = (id: number) => {
    setRemovedImageIds((previous) =>
      previous.includes(id) ? previous : [...previous, id],
    );
  };

  const restoreRemovedImageId = (id: number) => {
    setRemovedImageIds((previous) =>
      previous.filter((value) => value !== id),
    );
  };

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
    if (!file) {
      return;
    }

    if (existingCover) {
      addRemovedImageId(existingCover.id);
      setExistingCover(null);
      originalCoverRemovedRef.current = false;
    }

    setCoverImage(file);
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

      let added = 0;
      acceptedFiles.forEach((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (!fileMap.has(key) && fileMap.size < maxGalleryImages) {
          fileMap.set(key, file);
          added += 1;
        }
      });

      if (added === 0 && fileMap.size >= maxGalleryImages) {
        toast.error(`You can only add up to ${maxGalleryImages} gallery images.`);
      }

      return Array.from(fileMap.values());
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((previous) => previous.filter((_, position) => position !== index));
  };

  const handleRemoveExistingGalleryImage = (mediaId: number) => {
    setExistingGallery((previous) => previous.filter((media) => media.id !== mediaId));
    addRemovedImageId(mediaId);
  };

  const handleRemoveExistingCover = () => {
    if (!existingCover) {
      return;
    }

    addRemovedImageId(existingCover.id);
    setExistingCover(null);
    originalCoverRemovedRef.current = true;
  };

  const handleRemoveNewCover = () => {
    setCoverImage(null);
    setCoverPreview(null);

    if (mode === "edit") {
      const originalCover = originalCoverRef.current;
      if (originalCover && !originalCoverRemovedRef.current) {
        setExistingCover(originalCover);
        restoreRemovedImageId(originalCover.id);
      }
    }
  };

  const handleResetForm = () => {
    if (mode === "edit" && initialPropertyRef.current) {
      const property = initialPropertyRef.current;
      setFormState(buildFormStateFromProperty(property));

      const cover = property.media.find((media) => media.isCover) ?? null;
      setExistingCover(cover);
      originalCoverRef.current = cover;
      originalCoverRemovedRef.current = false;

      const gallery = property.media.filter((media) => !media.isCover);
      setExistingGallery(gallery);

      setCoverImage(null);
      setCoverPreview(null);
      setGalleryImages([]);
      setRemovedImageIds([]);
      return;
    }

    setFormState(initialFormState);
    setCoverImage(null);
    setCoverPreview(null);
    setGalleryImages([]);
    setExistingCover(null);
    setExistingGallery([]);
    setRemovedImageIds([]);
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

    if (mode === "edit") {
      if (!propertyId) {
        toast.error("Unable to determine property to update.");
        return;
      }

      const hasImages =
        Boolean(existingCover) ||
        existingGallery.length > 0 ||
        Boolean(coverImage) ||
        galleryImages.length > 0;

      if (!hasImages) {
        toast.error("Please keep or upload at least one image for the listing.");
        return;
      }

      const updatePayload: UpdatePropertyPayload = {
        title: formState.title.trim(),
        description: formState.description.trim() || undefined,
        propertyType: Number.parseInt(formState.propertyType, 10) as UpdatePropertyPayload["propertyType"],
        province: formState.province.trim(),
        city: formState.city.trim(),
        barangay: formState.barangay.trim() || undefined,
        zipCode: formState.zipCode.trim() || undefined,
        targetLocation: formState.targetLocation.trim() || undefined,
        landmark: formState.landmark.trim() || undefined,
        monthlyPrice,
        maxPersons: maxPersonsValue,
        moveInDate: formState.moveInDate || undefined,
        status: Number.parseInt(formState.status, 10) as UpdatePropertyPayload["status"],
        amenityCodes,
        newCoverImage: coverImage ?? undefined,
        newGalleryImages: galleryImages,
        removeImageIds: removedImageIds,
      };

      setIsSubmitting(true);
      try {
        await updateProperty(propertyId, updatePayload);
        toast.success("Property updated successfully.");
        navigate("/properties");
      } catch (error) {
        toast.error(extractErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!coverImage) {
      toast.error("Please upload a cover image.");
      return;
    }

    const createPayload: CreatePropertyPayload = {
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
      await createProperty(createPayload);
      toast.success("Property created successfully.");
      handleResetForm();
      navigate("/properties");
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
            <h1 className="text-3xl font-semibold">
              {mode === "edit" ? "Update property listing" : "Create a property listing"}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {mode === "edit"
                ? "Review the details below, adjust anything that has changed, and save your updates."
                : "Provide the property details, upload a cover image, and include any additional gallery images."}
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
                {coverImage ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveNewCover}
                    disabled={isSubmitting}
                  >
                    Remove
                  </Button>
                ) : mode === "edit" && existingCover ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveExistingCover}
                    disabled={isSubmitting}
                  >
                    Remove
                  </Button>
                ) : null}
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
                ) : existingCover ? (
                  <div className="flex w-full flex-col items-center gap-3">
                    <img
                      src={existingCover.url}
                      alt="Existing cover"
                      className="h-48 w-full rounded-md object-cover"
                    />
                    <p className="text-muted-foreground text-sm">
                      {mode === "edit"
                        ? "Click to replace the current cover image."
                        : "Drag and drop or click to upload a cover image."}
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
              {mode === "edit" && existingGallery.length > 0 && (
                <div className="space-y-3 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Existing images</p>
                    <p className="text-muted-foreground text-xs">
                      Removed images are deleted after you save changes.
                    </p>
                  </div>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {existingGallery.map((media) => (
                      <li
                        key={media.id}
                        className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={media.url}
                            alt={`Gallery image ${media.id}`}
                            className="h-16 w-16 rounded-md object-cover"
                          />
                          <span className="truncate text-xs text-muted-foreground">
                            Image #{media.id}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExistingGalleryImage(media.id)}
                          disabled={isSubmitting}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
                {mode === "edit" ? "Revert changes" : "Reset"}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? mode === "edit"
                    ? "Saving..."
                    : "Creating..."
                  : mode === "edit"
                    ? "Save changes"
                    : "Create property"}
              </Button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

const CreateProperty = () => {
  return <PropertyForm mode="create" />;
};

export default CreateProperty;
export { PropertyForm };
