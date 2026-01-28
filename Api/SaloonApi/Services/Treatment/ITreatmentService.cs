using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Dtos.ResponseDtos;

namespace SaloonApi.Services.Treatment;

public interface ITreatmentService
{
    Task<BaseResponse> AddTreatment(TreatmentData treatmentData);
    Task<BaseResponse> GetTreatments();
    Task<BaseResponse> UpdateTreatment(TreatmentData treatmentData);
    Task<BaseResponse> DeleteTreatment(string treatmentId);
}