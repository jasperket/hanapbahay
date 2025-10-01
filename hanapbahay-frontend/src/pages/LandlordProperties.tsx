import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";
import { Button } from "@/components/ui/button";
import {
  deleteProperty,
  getLandlordProperties,
} from "@/services/propertyClient";
import { listingStatusOptions, type Property } from "@/types/property";
import { PropertyCard } from "@/components/property/PropertyCard";

const LandlordProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const statusLookup = useMemo(() => {
    return new Map(
      listingStatusOptions.map((option) => [option.value, option.label]),
    );
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
      setProperties((previous) =>
        previous.filter((item) => item.id !== propertyId),
      );
      toast.success("Listing deleted.");
    } catch (error) {
      console.error("Failed to delete property", error);
      toast.error("Failed to delete the listing. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (propertyId: number) => {
    navigate(`/properties/${propertyId}`);
  };

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    propertyId: number,
  ) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleView(propertyId);
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
                Manage the listings you currently own, edit details, or remove
                properties that are no longer available.
              </p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground">Loading your listings...</p>
          ) : properties.length === 0 ? (
            <div className="bg-background flex flex-col items-start gap-3 rounded-lg border p-6 shadow-sm">
              <h2 className="text-xl font-medium">
                You haven't published any properties yet
              </h2>
              <p className="text-muted-foreground text-sm">
                Start by creating your first listing so renters can discover it.
              </p>
              <Button onClick={() => navigate("/properties/new")}>
                Create a listing
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => {
                const statusLabel =
                  statusLookup.get(property.status) ?? "Unknown";

                return (
                  <PropertyCard
                    property={property}
                    statusLabel={statusLabel}
                    deletingId={deletingId}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    onKeyDown={handleCardKeyDown}
                  />
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
