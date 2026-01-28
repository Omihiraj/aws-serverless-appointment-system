using Amazon.CognitoIdentityProvider;
using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Dtos.ResponseDtos;

namespace SaloonApi.Services.User;

public interface IUserService
{
    Task<BaseResponse> CreateUserWithTempPassword(UserData userData);
    Task<BaseResponse> DeleteUserAsync(string email, string userId);
    Task<BaseResponse> GetUsers();
}