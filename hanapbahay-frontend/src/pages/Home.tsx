import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/services/propertyClient";
import { propertyTypeOptions, type Property } from "@/types/property";
import { currencyFormatter } from "@/utils/formatters";

const Home = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const propertyTypeLookup = useMemo(() => {
    return new Map(
      propertyTypeOptions.map((option) => [option.value, option.label]),
    );
  }, []);

  const loadProperties = useCallback(async () => {
    if (!isMountedRef.current) {
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getProperties();
      if (isMountedRef.current) {
        setProperties(data);
      }
    } catch (error) {
      console.error("Failed to load properties", error);
      if (isMountedRef.current) {
        setLoadError(
          "We could not load the listings right now. Please try again.",
        );
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    loadProperties().catch((error) => {
      console.error("Unexpected error loading properties", error);
    });

    return () => {
      isMountedRef.current = false;
    };
  }, [loadProperties]);

  const renderSkeletons = () => {
    return Array.from({ length: 8 }, (_, index) => (
      <div
        key={`skeleton-${index}`}
        className="flex animate-pulse flex-col gap-3"
      >
        <div className="bg-muted aspect-[4/3] w-full rounded-3xl" />
        <div className="bg-muted h-4 w-3/4 rounded-full" />
        <div className="bg-muted h-3 w-1/2 rounded-full" />
        <div className="bg-muted h-3 w-1/3 rounded-full" />
      </div>
    ));
  };

  const renderContent = () => {
    if (isLoading) {
      return renderSkeletons();
    }

    if (loadError) {
      return (
        <div className="bg-muted/40 text-muted-foreground col-span-full flex flex-col items-center gap-4 rounded-3xl p-10 text-center">
          <p>{loadError}</p>
          <Button onClick={() => loadProperties()}>Try again</Button>
        </div>
      );
    }

    if (properties.length === 0) {
      return (
        <div className="text-muted-foreground bg-muted/40 col-span-full flex flex-col items-center rounded-3xl p-12 text-center">
          <p className="text-lg font-medium">
            No properties available just yet.
          </p>
          <p className="mt-2 max-w-md text-sm">
            Check back soon; new listings from verified landlords are added
            regularly.
          </p>
        </div>
      );
    }

    return properties.map((property) => {
      const coverImage =
        property.media.find((media) => media.isCover) ?? property.media[0];
      const propertyTypeLabel =
        propertyTypeLookup.get(property.propertyType) ?? "Property";

      return (
        <Link
          key={property.id}
          to={`/properties/${property.id}`}
          className="group flex flex-col gap-3"
        >
          <div className="bg-muted overflow-hidden rounded-3xl">
            {coverImage ? (
              <img
                src={coverImage.url}
                alt={`${property.title} cover`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="bg-muted text-muted-foreground flex aspect-[4/3] w-full items-center justify-center text-sm">
                No image available
              </div>
            )}
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-foreground group-hover:text-primary text-base leading-tight font-semibold transition-colors">
                {property.title}
              </h3>
              <p className="text-muted-foreground mt-1 truncate text-sm">
                {property.city}, {property.province}
              </p>
            </div>
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap">
              {propertyTypeLabel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-semibold">
                {currencyFormatter.format(property.monthlyPrice)}
              </span>{" "}
              / month
            </p>
            {property.maxPersons ? (
              <p className="text-muted-foreground text-xs">
                {property.maxPersons} persons
              </p>
            ) : null}
          </div>
        </Link>
      );
    });
  };

  return (
    <>
      <Navbar01 />
      <main>
        <section
          id="listings"
          className="container mx-auto max-w-6xl px-4 pt-8 pb-20"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">Available homes</h2>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {renderContent()}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
