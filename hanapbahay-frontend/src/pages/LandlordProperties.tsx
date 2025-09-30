import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";
import { Button } from "@/components/ui/button";
import { deleteProperty, getLandlordProperties } from "@/services/propertyClient";
import {
  listingStatusOptions,
  type Property,
} from "@/types/property";

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const LandlordProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const statusLookup = useMemo(() => {
    return new Map(listingStatusOptions.map((option) => [option.value, option.label]));
  }, []);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await getLandlordProperties();
        setProperties(data);
      } catch (error) {
        console.error("Unable to load landlord properties", error);
        toast.error("Unable to load your properties.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadProperties();
  }, []);

  const handleDelete = async (propertyId: number) => {
    const property = properties.find((item) => item.id === propertyId);
    const title = property?.title ?? "this property";

    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(propertyId);
    try {
      await deleteProperty(propertyId);
      setProperties((previous) => previous.filter((item) => item.id !== propertyId));
      toast.success("Listing deleted.");
    } catch (error) {
      console.error("Failed to delete property", error);
      toast.error("Failed to delete the listing. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (propertyId: number) => {
    navigate(`/properties/${propertyId}/edit`);
  };

  return (
    <>
      <Navbar01 />
      <main className="bg-muted/40">
        <section className="container mx-auto max-w-5xl px-4 py-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">My properties</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Manage the listings you currently own, edit details, or remove properties that are no longer available.
              </p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground">Loading your listings...</p>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-lg border bg-background p-6 shadow-sm">
              <h2 className="text-xl font-medium">You haven't published any properties yet</h2>
              <p className="text-muted-foreground text-sm">
                Start by creating your first listing so renters can discover it.
              </p>
              <Button onClick={() => navigate("/properties/new")}>Create a listing</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => {
                const cover = property.media.find((media) => media.isCover);
                const statusLabel =
                  statusLookup.get(property.status) ?? "Unknown";

                return (
                  <article
                    key={property.id}
                    className="flex flex-col gap-4 rounded-lg border bg-background p-4 shadow-sm sm:flex-row"
                  >
                    <div className="sm:w-48">
                      {cover ? (
                        <img
                          src={cover.url}
                          alt={`${property.title} cover`}
                          className="h-32 w-full rounded-md object-cover"
                        />
                      ) : (
                        <div className="bg-muted flex h-32 w-full items-center justify-center rounded-md text-sm text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-3">
                      <div>
                        <h2 className="text-lg font-semibold">{property.title}</h2>
                        <p className="text-muted-foreground text-sm">
                          {property.city}, {property.province}
                        </p>
                      </div>
                      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                            Status
                          </dt>
                          <dd className="font-medium">{statusLabel}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                            Monthly rent
                          </dt>
                          <dd className="font-medium">
                            {currencyFormatter.format(property.monthlyPrice)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                            Created
                          </dt>
                          <dd className="font-medium">
                            {dateFormatter.format(new Date(property.createdAt))}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                            Bedrooms / max tenants
                          </dt>
                          <dd className="font-medium">
                            {property.maxPersons ? `${property.maxPersons} persons` : "Not specified"}
                          </dd>
                        </div>
                      </dl>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleEdit(property.id)}
                          disabled={deletingId === property.id}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleDelete(property.id)}
                          disabled={deletingId === property.id}
                        >
                          {deletingId === property.id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default LandlordProperties;
