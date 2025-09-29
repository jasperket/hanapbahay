using AutoMapper;
using hanapbahay_backend.Dto.Property;
using hanapbahay_backend.Models.Entities;

namespace hanapbahay_backend.Mappings;

public class PropertyProfile : Profile
{
    public PropertyProfile()
    {
        CreateMap<AddPropertyRequest, Property>();

        CreateMap<Media, PropertyMediaResponse>();

        CreateMap<Property, PropertyResponse>()
            .ForMember(dest => dest.LandlordDisplayName, opt => opt.MapFrom(src => src.Landlord.DisplayName))
            .ForMember(dest => dest.AmenityCodes, opt => opt.MapFrom(src => src.PropertyAmenities
                .Select(pa => pa.Amenity.Code)))
            .ForMember(dest => dest.Media, opt => opt.MapFrom(src => src.Media
                .OrderBy(m => m.Order)
                .ThenBy(m => m.Id)));
    }
}
