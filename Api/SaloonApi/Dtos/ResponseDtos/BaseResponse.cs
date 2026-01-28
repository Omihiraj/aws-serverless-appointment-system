namespace SaloonApi.Dtos.ResponseDtos;

public record BaseResponse
(
    bool IsSuccess,
    string Message,
    object? Data
);