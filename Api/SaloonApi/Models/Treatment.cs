using Amazon.DynamoDBv2.DataModel;

namespace SaloonApi.Models;

[DynamoDBTable("SaloonTreatments")]
public class Treatment
{
    [DynamoDBHashKey]
    public string? Id { get; set; }

    [DynamoDBGlobalSecondaryIndexHashKey("SaloonIndex")]
    public string SaloonId { get; set; } = "ALL";
    
    [DynamoDBProperty]
    public string? TreatmentName { get; set; }
        
    [DynamoDBProperty]
    public string? TreatmentDuration { get; set; }
    
    [DynamoDBProperty]
    public double TreatmentAmount { get; set; }
    
    [DynamoDBProperty]
    public List<TreatmentProduct>? Products { get; set; }
    
}

public class TreatmentProduct()
{
    public string? ProductId { get; set; }

    public string? ProductName { get; set; }
}

