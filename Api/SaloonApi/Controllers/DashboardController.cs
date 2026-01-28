using Microsoft.AspNetCore.Mvc;
using SaloonApi.Dtos.ResponseDtos;
using SaloonApi.Services.Dashboard;

namespace SaloonApi.Controllers;

[ApiController]
[Route("/api/dashboard/v1")]
public class DashboardController(IDashboardService dashboard):ControllerBase
{
    [HttpGet("list")]
    public async Task<IActionResult> GetDashboardData([FromQuery] DateTime date)
    {
        var dashboardBaseResponse =  await dashboard.GetDashboardData(date);

        return dashboardBaseResponse.IsSuccess ? Ok(dashboardBaseResponse) : StatusCode(500, dashboardBaseResponse);
    }
    [HttpGet("initial-data")]
    public async Task<IActionResult> GetInitialDashboardData()
    {
        var dashboardBaseResponse =  await dashboard.GetInitialDashboardData();

        return dashboardBaseResponse.IsSuccess ? Ok(dashboardBaseResponse) : StatusCode(500, dashboardBaseResponse);
    }
}