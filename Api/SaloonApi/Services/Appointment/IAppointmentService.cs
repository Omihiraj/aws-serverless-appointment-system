using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Dtos.ResponseDtos;

namespace SaloonApi.Services.Appointment;

public interface IAppointmentService
{
    Task<BaseResponse> CreateAppointment(AppointmentData appointmentData);
    Task<BaseResponse> UpdateAppointment(UpdateAppointmentData appointmentData);
    Task<BaseResponse> GetAppointmentsByDate(DateTime date);
    Task<BaseResponse> GetAppointmentsByClientId(string clientId);
    Task<BaseResponse> DeleteAppointment(string appointmentId);
}