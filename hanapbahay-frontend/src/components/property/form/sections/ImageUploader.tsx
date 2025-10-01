import { Button } from "@/components/ui/button";
import {
  Dropzone,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import type { PropertyMedia } from "@/types/property";

interface Props {
  coverImage: File | null;
  coverPreview: string | null;
  existingCover: PropertyMedia | null;
  setCoverImage: (file: File | null) => void;
  setExistingCover: (media: PropertyMedia | null) => void;
  disabled: boolean;
}

export function ImageUploader({
  coverImage,
  coverPreview,
  existingCover,
  setCoverImage,
  setExistingCover,
  disabled,
}: Props) {
  const handleDrop = (files: File[]) => {
    const [file] = files;
    if (file) {
      if (existingCover) setExistingCover(null);
      setCoverImage(file);
    }
  };

  const handleRemove = () => {
    setCoverImage(null);
    setExistingCover(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Cover Image</p>
          <p className="text-muted-foreground text-xs">
            Upload a single cover image. This will be the primary photo for the
            listing.
          </p>
        </div>
        {(coverImage || existingCover) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={disabled}
          >
            Remove
          </Button>
        )}
      </div>

      <Dropzone
        accept={{ "image/*": [] }}
        maxFiles={1}
        onDrop={handleDrop}
        disabled={disabled}
      >
        {coverImage && coverPreview ? (
          <img
            src={coverPreview}
            className="h-48 w-full rounded-md object-cover"
          />
        ) : existingCover ? (
          <img
            src={existingCover.url}
            className="h-48 w-full rounded-md object-cover"
          />
        ) : (
          <DropzoneEmptyState className="text-center" />
        )}
      </Dropzone>
    </div>
  );
}
