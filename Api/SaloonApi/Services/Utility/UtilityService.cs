namespace SaloonApi.Services.Utility;

public static class UtilityService
{
    public static string GenerateUniqueId(UniqueId uniqueId)
    {
        var prefix = FindPrefix(uniqueId) ;
        var datePart = DateTime.UtcNow.ToString("yyMMdd"); // YYMMDD
        var guidPart = Guid.NewGuid().ToString("N")[..6].ToUpper(); // 6-char unique

        return $"{prefix}-{datePart}-{guidPart}";
    }

    private static string FindPrefix(UniqueId uniqueId)
    {
        return uniqueId switch
        {
            UniqueId.Appointment => "AP",
            UniqueId.Client => "C",
            UniqueId.Treatment => "TR",
            UniqueId.Therapist => "TH",
            UniqueId.Product => "PD",
            UniqueId.User => "U",
            _ => throw new ArgumentOutOfRangeException(nameof(uniqueId), uniqueId, null)
        };
    }
    public enum UniqueId
    {
        Appointment,
        Client,
        Treatment,
        Therapist,
        Product,
        User,
    }
}