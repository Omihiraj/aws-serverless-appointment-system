using Microsoft.AspNetCore.Mvc;
using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Dtos.ResponseDtos;
using SaloonApi.Services.Therapist;

namespace SaloonApi.Controllers
{
    [Route("api/therapist/v1")]
    [ApiController]
    public class TherapistController(ITherapistService therapistService) : ControllerBase
    {
        [HttpPost("add")]
        
        public async Task<IActionResult> AddTherapist(TherapistData therapistData)
        {
            var therapistBaseResponse =  await therapistService.AddTherapist(therapistData);

            return therapistBaseResponse.IsSuccess ? Ok(therapistBaseResponse) : StatusCode(500, therapistBaseResponse);
        }
        
        [HttpPut("update")]
        
        public async Task<IActionResult> UpdateTherapist(TherapistData therapistData)
        {
            var therapistBaseResponse =  await therapistService.UpdateTherapist(therapistData);

            return therapistBaseResponse.IsSuccess ? Ok(therapistBaseResponse) : StatusCode(500, therapistBaseResponse);
        }
        [HttpGet("list")]
        
        public async Task<IActionResult> GetTherapists()
        {
            var therapistBaseResponse =  await therapistService.GetTherapists();

            return therapistBaseResponse.IsSuccess ? Ok(therapistBaseResponse) : StatusCode(500, therapistBaseResponse);
        }
        
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteTherapist(string therapistId)
        {
            var therapistBaseResponse =  await therapistService.DeleteTherapist(therapistId);

            return therapistBaseResponse.IsSuccess ? Ok(therapistBaseResponse) : StatusCode(500, therapistBaseResponse);
        }
    }
}
