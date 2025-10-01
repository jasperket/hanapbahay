import { Button } from "@/components/ui/button";

interface Props {
  isSubmitting: boolean;
  mode: "create" | "edit";
}

export function FormActions({ isSubmitting, mode }: Props) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Button type="button" variant="outline" disabled={isSubmitting}>
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
  );
}
