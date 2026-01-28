using SaloonApi.Models;

namespace SaloonApi.Dtos.RequestDtos;

public record AppointmentData(
    string AppointmentId,
    string AppointmentStatus,
    string? ClientId,
    string ClientName,
    DateTime ClientBirthDay,
    string? MedicalHistory,
    string MobileNumber, 
    List<AppointmentTreatmentData> AppointmentTreatmentData
);

