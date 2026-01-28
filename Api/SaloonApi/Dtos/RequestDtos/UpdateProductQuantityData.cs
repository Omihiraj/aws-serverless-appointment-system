namespace SaloonApi.Dtos.RequestDtos;

public record UpdateProductQuantityData(
    string ProductId,
    int ProductQuantity
    );