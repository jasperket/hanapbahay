import { Button } from "@/components/ui/button";
import type { Property } from "@/types/property";
import { currencyFormatter, dateFormatter } from "@/utils/formatters";

interface PropertyCardProps {
  property: Property;
  statusLabel: string;
  deletingId: number | null;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>, id: number) => void;
}

export const PropertyCard = ({
  property,
  statusLabel,
  deletingId,
  onEdit,
  onDelete,
  onView,
  onKeyDown,
}: PropertyCardProps) => {
  const cover = property.media.find((m) => m.isCover);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`View details for ${property.title}`}
      onClick={() => onView(property.id)}
      onKeyDown={(event) => onKeyDown(event, property.id)}
      className="bg-background hover:border-primary focus-visible:ring-ring focus-visible:ring-offset-background flex cursor-pointer flex-col gap-4 rounded-lg border p-4 shadow-sm transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:flex-row"
    >
      {/* Cover image */}
      <div className="sm:w-48">
        {cover ? (
          <img
            src={cover.url}
            alt={`${property.title} cover`}
            className="h-32 w-full rounded-md object-cover"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-32 w-full items-center justify-center rounded-md text-sm">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold">{property.title}</h2>
          <p className="text-muted-foreground text-sm">
            {property.city}, {property.province}
          </p>
        </div>

        {/* Info grid */}
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground text-xs tracking-wide uppercase">
              Status
            </dt>
            <dd className="font-medium">{statusLabel}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs tracking-wide uppercase">
              Monthly rent
            </dt>
            <dd className="font-medium">
              {currencyFormatter.format(property.monthlyPrice)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs tracking-wide uppercase">
              Created
            </dt>
            <dd className="font-medium">
              {dateFormatter.format(new Date(property.createdAt))}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs tracking-wide uppercase">
              Bedrooms / max tenants
            </dt>
            <dd className="font-medium">
              {property.maxPersons
                ? `${property.maxPersons} persons`
                : "Not specified"}
            </dd>
          </div>
        </dl>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(property.id);
            }}
            disabled={deletingId === property.id}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(property.id);
            }}
            disabled={deletingId === property.id}
          >
            {deletingId === property.id ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </article>
  );
};
