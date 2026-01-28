using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Dtos.ResponseDtos;

namespace SaloonApi.Services.Therapist;

public interface ITherapistService
{
    Task<BaseResponse> AddTherapist(TherapistData therapistData);
    Task<BaseResponse> GetTherapists();
    Task<BaseResponse> UpdateTherapist(TherapistData therapistData);
    Task<BaseResponse> DeleteTherapist(string therapistId);
}