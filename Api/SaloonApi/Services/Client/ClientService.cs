using Amazon.DynamoDBv2.DataModel;
using SaloonApi.Dtos.ResponseDtos;

namespace SaloonApi.Services.Client;

public class ClientService(IDynamoDBContext context): IClientService
{
    public async Task<BaseResponse> GetClients()
    {
        try
        {
            var clients = await context.ScanAsync<Models.Client>(new List<ScanCondition>()).GetRemainingAsync();
            return new BaseResponse(true, "Get Clients Successfully.✌️", new { Clients = clients });
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Failed to Get Clients.😒", ex.Message);
        }
    }
}