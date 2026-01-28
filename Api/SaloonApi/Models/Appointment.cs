using Amazon.DynamoDBv2.DataModel;

namespace SaloonApi.Models;


    [DynamoDBTable("SaloonAppointments")]
    public class Appointment
    {
        [DynamoDBHashKey]
        public string? Id { get; set; }
        
        [DynamoDBGlobalSecondaryIndexHashKey("ClientIndex")]
        public string? ClientId { get; set; }
        
        [DynamoDBProperty]
        public string? ClientName { get; set; }
        
        [DynamoDBProperty]
        public string? AppointmentStatus { get; set; } = "PENDING";
        
        [DynamoDBProperty]
        public List<AppointmentTreatmentData> ? AppointmentTreatmentData  { get; set; }
        
        [DynamoDBProperty]
        public DateTime? AppointmentDateTime { get; set; }
        
        [DynamoDBProperty("AppointmentDateOnly")]
        public string? AppointmentDateOnly { get; set; }
        
        [DynamoDBProperty]
        [DynamoDBGlobalSecondaryIndexRangeKey("QuotationDateIndex")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;    

        [DynamoDBProperty]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }

    
    public class AppointmentTreatmentData
    {
        public string? TreatmentId { get; set; }
    
        public string? TreatmentType { get; set; }

        public string? AssignedTherapist{ get; set; }
    
        public DateTime TreatmentStartTime { get; set; }
    };
