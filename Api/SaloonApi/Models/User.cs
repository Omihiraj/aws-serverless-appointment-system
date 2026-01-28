using Amazon.DynamoDBv2.DataModel;

namespace SaloonApi.Models;

[DynamoDBTable("SaloonUsers")]
public class User
{
    [DynamoDBHashKey]
    public string? Id { get; set; }
    
    [DynamoDBProperty]
    public string? Name { get; set; }
    
    [DynamoDBProperty]
    public string? Email { get; set; }
    
    [DynamoDBProperty]
    public string? MobileNumber { get; set; }
    
    [DynamoDBProperty]
    public string? StaffId { get; set; }
    
    [DynamoDBProperty]
    public string? RoleType { get; set; }
}