using Microsoft.AspNetCore.Mvc;
using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Dtos.ResponseDtos;
using SaloonApi.Services.Appointment;

namespace SaloonApi.Controllers
{
    [Route("api/appointments/v1")]
    [ApiController]
    public class AppointmentController(IAppointmentService appointment) : ControllerBase
    {
        [HttpPost("create")]
        
        public async Task<IActionResult> CreateAppointment(AppointmentData appointmentData)
        {
            var appointmentBaseResponse =  await appointment.CreateAppointment(appointmentData);

            return appointmentBaseResponse.IsSuccess ? Ok(appointmentBaseResponse) : StatusCode(500, appointmentBaseResponse);
        }
        
        [HttpPut("update")]
        
        public async Task<IActionResult> UpdateAppointment(UpdateAppointmentData appointmentData)
        {
            var appointmentBaseResponse =  await appointment.UpdateAppointment(appointmentData);

            return appointmentBaseResponse.IsSuccess ? Ok(appointmentBaseResponse) : StatusCode(500, appointmentBaseResponse);
        }
        
        [HttpGet("list")]
        
        public async Task<IActionResult> ListAppointmentsByDate([FromQuery] DateTime date)
        {
            var appointmentBaseResponse =  await appointment.GetAppointmentsByDate(date);

            return appointmentBaseResponse.IsSuccess ? Ok(appointmentBaseResponse) : StatusCode(500, appointmentBaseResponse);
        }
        
        [HttpGet("list-by-client-id")]
        
        public async Task<IActionResult> ListAppointmentsByClientId(string clientId)
        {
            var appointmentBaseResponse =  await appointment.GetAppointmentsByClientId(clientId);

            return appointmentBaseResponse.IsSuccess ? Ok(appointmentBaseResponse) : StatusCode(500, appointmentBaseResponse);
        }
        
        [HttpDelete("delete")]
        
        public async Task<IActionResult> DeleteAppointment(string appointmentId)
        {
            var appointmentBaseResponse =  await appointment.DeleteAppointment(appointmentId);

            return appointmentBaseResponse.IsSuccess ? Ok(appointmentBaseResponse) : StatusCode(500, appointmentBaseResponse);
        }
        
    }
}
