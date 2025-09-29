using AutoMapper;
using hanapbahay_backend.Dto.Property;
using hanapbahay_backend.Models.Entities;

public class PropertyProfile : Profile
{
    public PropertyProfile()
    {
        CreateMap<AddPropertyRequest, Property>();
    }
}