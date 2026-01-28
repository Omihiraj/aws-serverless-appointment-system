namespace SaloonApi.Dtos.RequestDtos;

public record TherapistData(
    string? TherapistId,
    string TherapistName,
    string TherapistMobile,
    List<TherapistTreatmentDataData> AssignedTreatments
    );
    
public record TherapistTreatmentDataData(string TreatmentId, string TreatmentName);