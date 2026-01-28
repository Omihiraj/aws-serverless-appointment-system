
using Microsoft.AspNetCore.Mvc;
using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Services.User;

namespace SaloonApi.Controllers
{
    [Route("api/user/v1")]
    [ApiController]
    public class UserController(IUserService userService) : ControllerBase
    {
        [HttpPost("add")]
        
        public async Task<IActionResult>  CreateUser(UserData userData)
        {

            var userBaseResponse = await userService.CreateUserWithTempPassword(userData);

            return userBaseResponse.IsSuccess ? Ok(userBaseResponse) : StatusCode(500, userBaseResponse);
        }
        
        [HttpDelete("delete")]
        
        public async Task<IActionResult>  DeleteUser(string email, string userId)
        {
            
            var userBaseResponse = await userService.DeleteUserAsync(email, userId);

            return userBaseResponse.IsSuccess ? Ok(userBaseResponse) : StatusCode(500, userBaseResponse);
        }
        
        [HttpGet("list")]
        
        public async Task<IActionResult>  GetUser()
        {

            var userBaseResponse = await userService.GetUsers();

            return userBaseResponse.IsSuccess ? Ok(userBaseResponse) : StatusCode(500, userBaseResponse);
        }
    }
}
