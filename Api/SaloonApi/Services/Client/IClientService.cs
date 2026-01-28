using SaloonApi.Dtos.ResponseDtos;

namespace SaloonApi.Services.Client;

public interface IClientService
{
    Task<BaseResponse> GetClients();
}