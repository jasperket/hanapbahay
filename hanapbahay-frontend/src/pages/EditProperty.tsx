import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";
import { PropertyForm } from "@/components/property/form";
import { getPropertyById } from "@/services/propertyClient";
import type { Property } from "@/types/property";

const EditProperty = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const parsedPropertyId = propertyId
    ? Number.parseInt(propertyId, 10)
    : Number.NaN;

  useEffect(() => {
    if (Number.isNaN(parsedPropertyId)) {
      toast.error("Invalid property identifier.");
      navigate("/properties");
      return;
    }

    const loadProperty = async () => {
      setIsLoading(true);
      try {
        const data = await getPropertyById(parsedPropertyId);
        setProperty(data);
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          toast.error("Property not found.");
        } else {
          toast.error("Unable to load property details.");
        }
        navigate("/properties");
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty().catch((error) => {
      console.error("Failed to load property", error);
    });
  }, [parsedPropertyId, navigate]);

  if (Number.isNaN(parsedPropertyId)) {
    return null;
  }

  if (isLoading || !property) {
    return (
      <>
        <Navbar01 />
        <main className="bg-muted/40">
          <section className="container mx-auto max-w-4xl px-4 py-10">
            <p className="text-muted-foreground">Loading property details...</p>
          </section>
        </main>
      </>
    );
  }

  return (
    <PropertyForm
      mode="edit"
      propertyId={parsedPropertyId}
      initialProperty={property}
    />
  );
};

export default EditProperty;
