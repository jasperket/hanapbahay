import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";
import { Button } from "@/components/ui/button";
import { getPropertyById } from "@/services/propertyClient";
import {
  listingStatusOptions,
  propertyTypeOptions,
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

const formatOptionalDate = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return dateFormatter.format(parsed);
};

const LandlordPropertyDetails = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const parsedPropertyId = propertyId ? Number.parseInt(propertyId, 10) : Number.NaN;

  const statusLookup = useMemo(() => {
    return new Map(listingStatusOptions.map((option) => [option.value, option.label]));
  }, []);

  const propertyTypeLookup = useMemo(() => {
    return new Map(propertyTypeOptions.map((option) => [option.value, option.label]));
  }, []);

  useEffect(() => {
    if (Number.isNaN(parsedPropertyId)) {
      toast.error("Invalid property identifier.");
      navigate("/properties");
      return;
    }

    let active = true;

    const loadProperty = async () => {
      setIsLoading(true);
      try {
        const data = await getPropertyById(parsedPropertyId);
        if (active) {
          setProperty(data);
        }
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          toast.error("Property not found.");
        } else {
          toast.error("Unable to load property details.");
        }
        navigate("/properties");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadProperty().catch((error) => {
      console.error("Failed to load property", error);
    });

    return () => {
      active = false;
    };
  }, [parsedPropertyId, navigate]);

  if (Number.isNaN(parsedPropertyId)) {
    return null;
  }

  if (isLoading || !property) {
    return (
      <>
        <Navbar01 />
        <main className="bg-muted/40">
          <section className="container mx-auto max-w-5xl px-4 py-10">
            <Button variant="outline" onClick={() => navigate("/properties")}>Back to properties</Button>
            <p className="text-muted-foreground mt-6">Loading property details...</p>
          </section>
        </main>
      </>
    );
  }

  const coverImage = property.media.find((media) => media.isCover) ?? property.media[0];
  const galleryImages = property.media.filter((media) => media.id !== coverImage?.id);
  const statusLabel = statusLookup.get(property.status) ?? "Unknown";
  const propertyTypeLabel = propertyTypeLookup.get(property.propertyType) ?? "Unknown";
  const moveInDateLabel = formatOptionalDate(property.moveInDate);
  const createdAtLabel = formatOptionalDate(property.createdAt);

  return (
    <>
      <Navbar01 />
      <main className="bg-muted/40">
        <section className="container mx-auto max-w-5xl px-4 py-10">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate("/properties")}>
              Back to properties
            </Button>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold">{property.title}</h1>
              <p className="text-muted-foreground text-sm">
                {property.city}, {property.province}
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
              {coverImage ? (
                <img
                  src={coverImage.url}
                  alt={`${property.title} cover`}
                  className="h-80 w-full object-cover"
                />
              ) : (
                <div className="bg-muted flex h-80 w-full items-center justify-center text-sm text-muted-foreground">
                  No images available
                </div>
              )}
            </div>

            {galleryImages.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold">Gallery</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryImages.map((media) => (
                    <img
                      key={media.id}
                      src={media.url}
                      alt={`${property.title} gallery image`}
                      className="h-48 w-full rounded-md object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {property.description && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}

            <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                  Property type
                </dt>
                <dd className="font-medium">{propertyTypeLabel}</dd>
              </div>
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
                  Max tenants
                </dt>
                <dd className="font-medium">
                  {property.maxPersons ? `${property.maxPersons} persons` : "Not specified"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                  Move-in date
                </dt>
                <dd className="font-medium">
                  {moveInDateLabel ?? "Not specified"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                  Created
                </dt>
                <dd className="font-medium">{createdAtLabel ?? "Not specified"}</dd>
              </div>
              {property.targetLocation && (
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                    Target location
                  </dt>
                  <dd className="font-medium">{property.targetLocation}</dd>
                </div>
              )}
              {property.landmark && (
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wide">
                    Landmark
                  </dt>
                  <dd className="font-medium">{property.landmark}</dd>
                </div>
              )}
            </dl>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Amenities</h2>
              {property.amenityCodes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {property.amenityCodes.map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No amenities specified for this property.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LandlordPropertyDetails;
