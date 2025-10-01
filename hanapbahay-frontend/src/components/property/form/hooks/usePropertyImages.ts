import { useState, useEffect } from "react";
import type { PropertyMedia } from "@/types/property";

export function usePropertyImages(
  initialCover: PropertyMedia | null,
  initialGallery: PropertyMedia[],
) {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [existingCover, setExistingCover] = useState<PropertyMedia | null>(
    initialCover,
  );
  const [existingGallery, setExistingGallery] =
    useState<PropertyMedia[]>(initialGallery);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

  // preview
  useEffect(() => {
    if (!coverImage) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(coverImage);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverImage]);

  return {
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
  };
}
