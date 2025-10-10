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
import { currencyFormatter, dateFormatter } from "@/utils/formatters";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

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

const PropertyDetails = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const isLandlord =
    user?.roles?.some((role) => role.toLowerCase() === "landlord") ?? false;
  const fallbackPath = isLandlord ? "/properties" : "/";
  const backButtonLabel = isLandlord
    ? "Back to my properties"
    : "Back to listings";

  const parsedPropertyId = propertyId
    ? Number.parseInt(propertyId, 10)
    : Number.NaN;

  const statusLookup = useMemo(() => {
    return new Map(
      listingStatusOptions.map((option) => [option.value, option.label]),
    );
  }, []);

  const propertyTypeLookup = useMemo(() => {
    return new Map(
      propertyTypeOptions.map((option) => [option.value, option.label]),
    );
  }, []);

  useEffect(() => {
    if (Number.isNaN(parsedPropertyId)) {
      toast.error("Invalid property identifier.");
      navigate(fallbackPath);
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
        navigate(fallbackPath);
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
  }, [parsedPropertyId, fallbackPath, navigate]);

  if (Number.isNaN(parsedPropertyId)) {
    return null;
  }

  if (isLoading || !property) {
    return (
      <>
        <Navbar01 />
        <main>
          <section className="container mx-auto max-w-5xl px-4 py-10">
            <Button
              variant="ghost"
              className="flex gap-4"
              onClick={() => navigate(fallbackPath)}
            >
              <ArrowLeft />
              {backButtonLabel}
            </Button>
            <p className="text-muted-foreground mt-6">
              Loading property details...
            </p>
          </section>
        </main>
      </>
    );
  }

  const coverImage =
    property.media.find((media) => media.isCover) ?? property.media[0];
  const galleryImages = property.media.filter(
    (media) => media.id !== coverImage?.id,
  );
  const statusLabel = statusLookup.get(property.status) ?? "Unknown";
  const propertyTypeLabel =
    propertyTypeLookup.get(property.propertyType) ?? "Unknown";
  const moveInDateLabel = formatOptionalDate(property.moveInDate);
  const createdAtLabel = formatOptionalDate(property.createdAt);
  const landlordPhoneNumber =
    property.landlordPhoneNumber &&
    property.landlordPhoneNumber.trim().length > 0
      ? property.landlordPhoneNumber.trim()
      : null;

  const amenities = property.amenityCodes.map((code, index) => {
    const label = property.amenityLabels[index];
    if (typeof label === "string") {
      const trimmed = label.trim();
      if (trimmed.length > 0) {
        return { code, label: trimmed };
      }
    }
    return { code, label: code };
  });

  return (
    <>
      <Navbar01 />
      <main className="bg-muted/40">
        <section className="container mx-auto max-w-5xl px-4 py-10">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="flex gap-4"
              onClick={() => navigate(fallbackPath)}
            >
              <ArrowLeft />
              {backButtonLabel}
            </Button>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold">{property.title}</h1>
              <p className="text-muted-foreground text-sm">
                {property.city}, {property.province}
              </p>
            </div>

            <div className="flex justify-center overflow-hidden rounded-lg border bg-gray-200 shadow-sm">
              {coverImage ? (
                <img
                  src={coverImage.url}
                  alt={`${property.title} cover`}
                  className="h-80 object-cover"
                />
              ) : (
                <div className="bg-muted text-muted-foreground flex h-80 w-full items-center justify-center text-sm">
                  No images available
                </div>
              )}
            </div>

            {galleryImages.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold">Gallery</h2>
                <div className="mt-3 flex gap-3 overflow-x-auto">
                  {galleryImages.map((media) => (
                    <img
                      key={media.id}
                      src={media.url}
                      alt={`${property.title} gallery image`}
                      className="max-w-36 rounded-md object-cover"
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

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Landlord</h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                    Name
                  </dt>
                  <dd className="font-medium">
                    {property.landlordDisplayName}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                    Phone
                  </dt>
                  <dd className="font-medium">
                    {landlordPhoneNumber ?? "Not provided"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Details</h2>
              <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                    Property type
                  </dt>
                  <dd className="font-medium">{propertyTypeLabel}</dd>
                </div>
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
                    Max tenants
                  </dt>
                  <dd className="font-medium">
                    {property.maxPersons
                      ? `${property.maxPersons} persons`
                      : "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                    Move-in date
                  </dt>
                  <dd className="font-medium">
                    {moveInDateLabel ?? "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                    Created
                  </dt>
                  <dd className="font-medium">
                    {createdAtLabel ?? "Not specified"}
                  </dd>
                </div>
                {property.streetAddress && (
                  <div>
                    <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                      Street Address
                    </dt>
                    <dd className="font-medium">{property.streetAddress}</dd>
                  </div>
                )}
                {property.landmark && (
                  <div>
                    <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                      Landmark
                    </dt>
                    <dd className="font-medium">{property.landmark}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Amenities</h2>
              {amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <span
                      key={amenity.code}
                      className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {amenity.label}
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

export default PropertyDetails;
