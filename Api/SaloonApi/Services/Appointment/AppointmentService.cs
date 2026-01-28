using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Dtos.ResponseDtos;
using SaloonApi.Models;
using SaloonApi.Services.Utility;
namespace SaloonApi.Services.Appointment;

public class AppointmentService(IDynamoDBContext context): IAppointmentService
{
    public async Task<BaseResponse> CreateAppointment(AppointmentData appointmentData)
    {
        try
        {
            var clientId = appointmentData.ClientId;
            
            if (clientId != null)
            {
                var existingClient = await context.LoadAsync<Models.Client>(appointmentData.ClientId);
                
                if (existingClient == null)
                {
                    clientId = UtilityService.GenerateUniqueId((UtilityService.UniqueId.Client));
                    Models.Client client = new()
                    {
                        Id = clientId,
                        Name = appointmentData.ClientName,
                        MobileNumber = appointmentData.MobileNumber,
                        MedicalHistory = appointmentData.MedicalHistory,
                        DateOfBirth = appointmentData.ClientBirthDay
                    };
                
                    await context.SaveAsync(client);
                }
            }
            else
            {
                clientId = UtilityService.GenerateUniqueId((UtilityService.UniqueId.Client));
                Models.Client client = new()
                {
                    Id = clientId,
                    Name = appointmentData.ClientName,
                    MobileNumber = appointmentData.MobileNumber,
                    MedicalHistory = appointmentData.MedicalHistory,
                    DateOfBirth = appointmentData.ClientBirthDay
                };
                
                await context.SaveAsync(client);
            }

            
            Models.Appointment appointment = new ()
            {
                Id = UtilityService.GenerateUniqueId(UtilityService.UniqueId.Appointment),
                AppointmentTreatmentData = appointmentData.AppointmentTreatmentData,
                AppointmentDateTime = appointmentData.AppointmentTreatmentData[0].TreatmentStartTime.ToUniversalTime(),
                AppointmentDateOnly = appointmentData.AppointmentTreatmentData[0].TreatmentStartTime.ToUniversalTime().ToString("yyyy-MM-dd"),
                ClientId = clientId,  
                ClientName = appointmentData.ClientName,
            };
            
            await context.SaveAsync(appointment);
            
            return new BaseResponse(true, "Appointment Created Successfully.✌️", new { Appointment = appointment});
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Appointment Created Unsuccessfully.😒", ex.Message);
        }

    }

    public async Task<BaseResponse> UpdateAppointment(UpdateAppointmentData appointmentData)
    {
        try
        {

            var existingAppointment = await context.LoadAsync<Models.Appointment>(appointmentData.AppointmentId);

            if (existingAppointment == null)
                return new BaseResponse(false, "Can't Found Appointments.😒", null); 

                
            existingAppointment.AppointmentStatus = appointmentData.AppointmentStatus;

            await context.SaveAsync(existingAppointment);

            decimal totalAmount = 0;
            if (appointmentData.AppointmentStatus == "COMPLETED")
            {
                var client = new AmazonDynamoDBClient();


                if (existingAppointment.AppointmentTreatmentData != null)
                {
                    var request = new BatchGetItemRequest
                    {
                        RequestItems = new Dictionary<string, KeysAndAttributes>
                        {
                            {
                                "SaloonTreatments",
                                new KeysAndAttributes
                                {
                                    Keys = existingAppointment.AppointmentTreatmentData
                                        .Where(t => !string.IsNullOrEmpty(t.TreatmentId))
                                        .Select(t => new Dictionary<string, AttributeValue>
                                        {
                                            { "Id", new AttributeValue { S = t.TreatmentId! } }
                                        })
                                        .ToList()
                                }
                            }
                        },
                    };
                    var response = await client.BatchGetItemAsync(request);
                    
                    
                     totalAmount = response.Responses["SaloonTreatments"]
                        .Where(item => item.ContainsKey("TreatmentAmount"))
                        .Sum(item => decimal.Parse(
                            item["TreatmentAmount"].N,
                            System.Globalization.CultureInfo.InvariantCulture
                        ));
                }
                
            }

            return new BaseResponse(true, $"Appointment `{appointmentData.AppointmentStatus}` Updated Successfully.✌️", new { Appointment = existingAppointment, PackageDetails =totalAmount==0?null: new{ Amount = totalAmount} }) ;
        }
        catch (Exception ex)
        {

            return new BaseResponse(false, $"Oh... Appointment `{appointmentData.AppointmentStatus}` Updated Unsuccessfully.😒", ex.Message);
        }
    }
    
    public async Task<BaseResponse> GetAppointmentsByDate(DateTime date)
    {
        try
        {
            var targetDate = date.ToString("yyyy-MM-dd");
            
            var queryConfig = new QueryOperationConfig
            {
                IndexName = "AppointmentDateIndex",
                KeyExpression = new Expression
                {
                    ExpressionStatement = "AppointmentDateOnly = :v_date",
                    ExpressionAttributeValues = new Dictionary<string, DynamoDBEntry>
                    {
                        { ":v_date", targetDate }
                    }
                }
            };


            var table = context.GetTargetTable<Models.Appointment>();
            var search = table.Query(queryConfig);


            var documents = await search.GetNextSetAsync();
            var results = context.FromDocuments<Models.Appointment>(documents);

            

            
            return new BaseResponse(true, "Appointments Data Loaded Successfully.✌️", new { Appointments = results});
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Appointments Data Loaded Unsuccessfully.😒", ex.Message);
        }

    }
    
    public async Task<BaseResponse> GetAppointmentsByClientId(string clientId)
    {
        try
        {
            var treatmentQueryConfig = new DynamoDBOperationConfig
            {
                IndexName = "ClientIndex" // Use GSI
            };

            var appointments = await context.QueryAsync<Models.Appointment>(clientId, treatmentQueryConfig).GetRemainingAsync();
            
            return new BaseResponse(true, "Get Appointments By ClientId Successfully.✌️", new { Appointments = appointments });
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Failed to Get Appointments.😒", ex.Message);
        }

    }
    
    public async Task<BaseResponse> DeleteAppointment(string appointmentId)
    {
        try
        {
            var existingAppointment = await context.LoadAsync<Models.Appointment>(appointmentId);

            if (existingAppointment == null)
                return new BaseResponse(false, "Can't Found Appointment.😒", null); 

            await context.DeleteAsync(existingAppointment);

            return new BaseResponse(true, "Appointment Deleted Successfully.✌️", null);
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Appointment Deleted Unsuccessfully.😒", ex.Message);
        }
    }
    
    
}