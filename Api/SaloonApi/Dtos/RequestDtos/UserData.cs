namespace SaloonApi.Dtos.RequestDtos;

public record UserData(
    string? Id,
    string Name,
    string Email,
    string MobileNumber,
    string RoleType
    );