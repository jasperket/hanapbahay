import { Button } from "@/components/ui/button";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import type { PropertyMedia } from "@/types/property";

interface Props {
  galleryImages: File[];
  existingGallery: PropertyMedia[];
  setGalleryImages: (files: File[]) => void;
  setExistingGallery: (media: PropertyMedia[]) => void;
  setRemovedImageIds: (updater: (prev: number[]) => number[]) => void;
  disabled: boolean;
}

const maxGalleryImages = 10;

export function GalleryUploader({
  galleryImages,
  existingGallery,
  setGalleryImages,
  setExistingGallery,
  setRemovedImageIds,
  disabled,
}: Props) {
  const handleDrop = (files: File[]) => {
    setGalleryImages([...galleryImages, ...files].slice(0, maxGalleryImages));
  };

  const removeExisting = (id: number) => {
    setExistingGallery(existingGallery.filter((m) => m.id !== id));
    setRemovedImageIds((prev) => [...prev, id]);
  };

  const removeNew = (idx: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Gallery Images</p>
        {galleryImages.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setGalleryImages([])}
            disabled={disabled}
          >
            Clear All
          </Button>
        )}
      </div>

      {existingGallery.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {existingGallery.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
            >
              <img src={m.url} className="h-16 w-16 rounded-md object-cover" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExisting(m.id)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Dropzone
        accept={{ "image/*": [] }}
        multiple
        maxFiles={maxGalleryImages}
        onDrop={handleDrop}
        disabled={disabled}
      >
        <DropzoneContent className="text-center" />
        <DropzoneEmptyState className="text-center" />
      </Dropzone>

      {galleryImages.length > 0 && (
        <ul className="space-y-2">
          {galleryImages.map((f, i) => (
            <li
              key={`${f.name}-${f.size}`}
              className="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <span className="truncate">{f.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeNew(i)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
