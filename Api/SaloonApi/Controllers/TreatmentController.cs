using Microsoft.AspNetCore.Mvc;
using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Dtos.ResponseDtos;
using SaloonApi.Services.Treatment;

namespace SaloonApi.Controllers
{
    [Route("api/treatment/v1")]
    [ApiController]
    public class TreatmentController(ITreatmentService treatmentService) : ControllerBase
    {
        [HttpPost("add")]
        
        public async Task<IActionResult> CreateTreatment(TreatmentData treatmentData)
        {
            var treatmentBaseResponse =  await treatmentService.AddTreatment(treatmentData);

            return treatmentBaseResponse.IsSuccess ? Ok(treatmentBaseResponse) : StatusCode(500, treatmentBaseResponse);
        }
        
        [HttpPut("update")]
        
        public async Task<IActionResult> UpdateTreatment(TreatmentData treatmentData)
        {
            var treatmentBaseResponse =  await treatmentService.UpdateTreatment(treatmentData);

            return treatmentBaseResponse.IsSuccess ? Ok(treatmentBaseResponse) : StatusCode(500, treatmentBaseResponse);
        }
        [HttpGet("list")]
        
        public async Task<IActionResult> GetTreatments()
        {
            var treatmentBaseResponse =  await treatmentService.GetTreatments();

            return treatmentBaseResponse.IsSuccess ? Ok(treatmentBaseResponse) : StatusCode(500, treatmentBaseResponse);
        }
        
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteTreatment(string treatmentId)
        {
            var treatmentBaseResponse =  await treatmentService.DeleteTreatment(treatmentId);

            return treatmentBaseResponse.IsSuccess ? Ok(treatmentBaseResponse) : StatusCode(500, treatmentBaseResponse);
        }
    }
}
