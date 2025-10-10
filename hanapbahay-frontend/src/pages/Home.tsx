import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";
import HomeListing from "@/components/home/HomeListing";
import { getAmenities, getFilteredProperties } from "@/services/propertyClient";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router";
import {
  propertyTypeOptions,
  type PropertyFilterParams,
} from "@/types/property";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [amenityValues, setAmenityValues] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [propertyTypeValue, setPropertyTypeValue] = useState<string>("");

  const filters: PropertyFilterParams = {
    search: searchParams.get("search") || undefined,
    propertyType: searchParams.get("propertyType")
      ? Number(searchParams.get("propertyType"))
      : undefined,
    amenityCodes: searchParams.getAll("amenityCodes"),
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    pageSize: searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : 10,
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["properties"],
    queryFn: () => getFilteredProperties(filters),
    refetchOnWindowFocus: false,
  });

  const amenityQuery = useQuery({
    queryKey: ["amenities"],
    queryFn: () => getAmenities(),
    refetchOnWindowFocus: false,
  });

  const filteredAmenities = amenityQuery?.data?.filter(
    (amenity) => !amenityValues.includes(amenity.code),
  );

  const handleRemoveAmenity = (code: string) => {
    setAmenityValues((prev) => prev.filter((value) => value !== code));
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handlePropertyTypeChange = (value: string) => {
    setPropertyTypeValue(value);
  };

  return (
    <>
      <Navbar01 />
      <main>
        <section
          id="listings"
          className="container mx-auto max-w-6xl px-4 pt-8 pb-20"
        >
          <form className="mb-8 flex gap-2 rounded-xl bg-gray-100 p-2 shadow">
            <Input
              type="search"
              name="search"
              id="search"
              placeholder="Search for a property"
              className="h-10"
              value={searchValue}
              onChange={handleSearchInputChange}
            />
            <Select
              value={propertyTypeValue}
              onValueChange={handlePropertyTypeChange}
            >
              <SelectTrigger className="!h-10 min-w-48 bg-white">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value.toString()}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="h-10 w-56 justify-between"
                >
                  {amenityValues.length > 0 ? (
                    "View Selected Amenities"
                  ) : (
                    <span className="text-gray-500">Select amenity</span>
                  )}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0">
                <div
                  className={cn(
                    "flex-wrap gap-1 p-2",
                    amenityValues.length > 0 ? "flex" : "hidden",
                  )}
                >
                  {amenityValues.map((value) => {
                    const label = amenityQuery?.data?.find(
                      (amenity) => amenity.code === value,
                    )?.label;
                    return (
                      <Badge key={value} className="hover:bg-black/60" asChild>
                        <button
                          className="gap-1"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveAmenity(value);
                          }}
                        >
                          <span>{label}</span>
                          <X />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
                <Command>
                  <CommandInput
                    placeholder="Search amenity..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No amenity found.</CommandEmpty>
                    <CommandGroup>
                      {filteredAmenities?.map((amenity) => (
                        <CommandItem
                          key={amenity.code}
                          value={amenity.code}
                          onSelect={(currentValue) => {
                            setAmenityValues((prev) => {
                              return [...prev, currentValue];
                            });
                          }}
                        >
                          {amenity.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              amenityValues.includes(amenity.code)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </form>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">For Rent</h2>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <HomeListing />
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
