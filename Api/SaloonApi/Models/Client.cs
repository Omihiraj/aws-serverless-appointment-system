using Amazon.DynamoDBv2.DataModel;

namespace SaloonApi.Models;

[DynamoDBTable("SaloonClients")]
public class Client
{
    [DynamoDBHashKey]
    public string? Id { get; set; }

    [DynamoDBProperty]
    public string? Name { get; set; }
        
    [DynamoDBProperty]
    public string? MobileNumber { get; set; }
    
    [DynamoDBProperty]
    public string? MedicalHistory { get; set; }
    
    [DynamoDBProperty]
    public DateTime? DateOfBirth { get; set; }

}