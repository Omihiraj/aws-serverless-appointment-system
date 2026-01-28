using Amazon.DynamoDBv2.DataModel;

namespace SaloonApi.Models;

[DynamoDBTable("SaloonProducts")]
public class Product
{
    [DynamoDBHashKey]
    public string? Id { get; set; }

    [DynamoDBProperty]
    public string? ProductName { get; set; }
        
    [DynamoDBProperty]
    public string? ProductCode { get; set; }
    
    [DynamoDBProperty]
    public int ProductQuantity { get; set; }
    
    [DynamoDBProperty]
    public DateTime? LastUpdatedDate { get; set; }
    
}