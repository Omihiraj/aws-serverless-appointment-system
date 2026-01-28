namespace SaloonApi.Dtos.RequestDtos;

public record UpdateAppointmentData( 
    string AppointmentId,
    string AppointmentStatus,
    string TreatmentId
    );