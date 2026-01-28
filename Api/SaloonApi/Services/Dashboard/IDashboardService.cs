using SaloonApi.Dtos.ResponseDtos;

namespace SaloonApi.Services.Dashboard;

public interface IDashboardService
{
    Task<BaseResponse> GetDashboardData(DateTime date);
    Task<BaseResponse> GetInitialDashboardData();
}