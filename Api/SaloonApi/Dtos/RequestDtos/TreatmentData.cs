namespace SaloonApi.Dtos.RequestDtos;

public record TreatmentData(
    string? TreatmentId,
    string TreatmentName,
    string TreatmentDuration,
    double Amount,
    List<TreatmentProductData> Products
    );
    
public record TreatmentProductData(string ProductId, string ProductName);    