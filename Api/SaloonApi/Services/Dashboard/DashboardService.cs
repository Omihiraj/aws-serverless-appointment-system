using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using SaloonApi.Dtos.ResponseDtos;
namespace SaloonApi.Services.Dashboard;

public class DashboardService(IDynamoDBContext context): IDashboardService
{
    public async Task<BaseResponse> GetDashboardData(DateTime date)
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

            

            
            return new BaseResponse(true, "Dashboard Data Loaded Successfully.✌️", new { Appointments = results});
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Dashboard Data Loaded Unsuccessfully.😒", ex.Message);
        }

    }
    
    
    public async Task<BaseResponse> GetInitialDashboardData()
    {
        try
        {
            
            var targetDate = DateTime.Now.ToString("yyyy-MM-dd");
            
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
            
            var appointments = context.FromDocuments<Models.Appointment>(documents);
            
            
            var treatmentQueryConfig = new DynamoDBOperationConfig
            {
                IndexName = "SaloonIndex" // Use GSI
            };

            var treatments = await context.QueryAsync<Models.Treatment>("ALL", treatmentQueryConfig).GetRemainingAsync();
            
            

            //var treatments = await context.ScanAsync<Models.Treatment>(new List<ScanCondition>()).GetRemainingAsync();

            var therapists = await context.ScanAsync<Models.Therapist>(new List<ScanCondition>()).GetRemainingAsync();
            
            var products = await context.ScanAsync<Models.Product>(new List<ScanCondition>()).GetRemainingAsync();
            
            return new BaseResponse(true, "Dashboard Data Loaded Successfully.✌️", new { Appointments = appointments, Therapists = therapists , Treatments = treatments, Products = products });
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Dashboard Data Loaded Unsuccessfully.😒", ex.Message);
        }

    }
}