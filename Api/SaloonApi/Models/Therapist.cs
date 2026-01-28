using Amazon.DynamoDBv2.DataModel;

namespace SaloonApi.Models;

[DynamoDBTable("SaloonTherapists")]
public class Therapist
{
    [DynamoDBHashKey]
    public string? Id { get; set; }

    [DynamoDBProperty]
    public string? TherapistName { get; set; }
        
    [DynamoDBProperty]
    public string? TherapistMobile { get; set; }
    
    [DynamoDBProperty]
    public List<TherapistTreatmentData>? AssignedTreatments { get; set; }

}

public class TherapistTreatmentData
{
    public string? TreatmentId {set; get;} 
    public string? TreatmentName {set; get;} 
}