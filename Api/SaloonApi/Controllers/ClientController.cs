using Microsoft.AspNetCore.Mvc;
using SaloonApi.Dtos.ResponseDtos;
using SaloonApi.Services.Client;

namespace SaloonApi.Controllers
{
    [Route("api/client/v1")]
    [ApiController]
    public class ClientController(IClientService clientService) : ControllerBase
    {
        
        [HttpGet("list")]
        
        public async Task<IActionResult>  GetClients()
        {
            var productBaseResponse =  await clientService.GetClients();

            return productBaseResponse.IsSuccess ? Ok(productBaseResponse) : StatusCode(500, productBaseResponse);
        }
    }
}
