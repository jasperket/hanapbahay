using AutoMapper;
using hanapbahay_backend.Dto.Auth;
using hanapbahay_backend.Models.Entities;

namespace hanapbahay_backend.Mappings;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<RegisterRequest, User>()
        .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));
    }
}