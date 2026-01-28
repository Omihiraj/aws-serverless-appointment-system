namespace SaloonApi.Dtos.RequestDtos;

public record ProductData(
    string ProductName,
    string ProductCode,
    int ProductQuantity,
    DateTime LastUpdatedDate
    );