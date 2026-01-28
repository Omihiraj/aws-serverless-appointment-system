
using Amazon;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Amazon.DynamoDBv2.DataModel;
using SaloonApi.Dtos.RequestDtos;
using SaloonApi.Dtos.ResponseDtos;
using SaloonApi.Services.Utility;

namespace SaloonApi.Services.User;

public class UserService(IDynamoDBContext context):IUserService
{
    public async Task<BaseResponse> CreateUserWithTempPassword(UserData userData)
    {
        try
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
            
            var region = RegionEndpoint.GetBySystemName(config["AWS:Region"]);
            var userPoolId = config["AWS:Cognito:UserPoolId"];
            
            
          
            var username = userData.Email;
            var email = userData.Email;
            var tempPassword = "Abcd@1234!";
            var sendInviteEmail = true;
           

            var client = new AmazonCognitoIdentityProviderClient(region);
            
            var req = new AdminCreateUserRequest
            {
                UserPoolId = userPoolId,
                Username = username,
                TemporaryPassword = tempPassword,
                UserAttributes = new List<AttributeType>
                {
                    new AttributeType { Name = "email", Value = email },
                    new AttributeType { Name = "email_verified", Value = "true" },

                }
            };

            if (sendInviteEmail)
            {
                // Let Cognito send the invitation via email
                req.DesiredDeliveryMediums = new List<string> { DeliveryMediumType.EMAIL };
                // Do NOT set MessageAction=SUPPRESS, otherwise no email is sent.
            }
            else
            {
                // Suppress Cognito’s email/SMS if you send your own email
                req.MessageAction = MessageActionType.SUPPRESS;
            }

            var resp = await client.AdminCreateUserAsync(req);
            Console.WriteLine($"Created user '{resp.User.Username}'. Status: {resp.User.UserStatus}");
            
            //Permanent Password Set
            await client.AdminSetUserPasswordAsync(new AdminSetUserPasswordRequest
            {
                UserPoolId = userPoolId,
                Username = username,
                Password = tempPassword,
                Permanent = true
            });
            Console.WriteLine("Permanent password set.");
            
            //Save User In the DB
            var userId = UtilityService.GenerateUniqueId(UtilityService.UniqueId.User); 
            Models.User user = new()
            {
                Id = userId,
                Name = userData.Name,
                Email = userData.Email,
                MobileNumber = userData.MobileNumber,
                StaffId = userId,
                RoleType = userData.RoleType
            };

            await context.SaveAsync(user);

            return new BaseResponse(true, "User Added Successfully.✌️", new { User = user });
        }
        catch (UsernameExistsException)
        {
            Console.WriteLine("User already exists.");
            return new BaseResponse(false, "User already exists.", null);
        }
        catch (InvalidPasswordException ex)
        {
            Console.WriteLine($"Password doesn't meet the pool policy: {ex.Message}");
            return new BaseResponse(false, $"Password doesn't meet the pool policy: {ex.Message}", ex.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to create user: {ex.Message}");
            return new BaseResponse(false, "Failed to create user: {ex.Message}", ex.Message);
        }
    }
    
    
    public async Task<BaseResponse> DeleteUserAsync(string email, string userId)
    {
        try
        {
            var existingUser = await context.LoadAsync<Models.User>(userId);

            if (existingUser == null)
                return new BaseResponse(false, "Can't Found User.😒", null); 
            
            
            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
            
            var region = RegionEndpoint.GetBySystemName(config["AWS:Region"]);
            var userPoolId = config["AWS:Cognito:UserPoolId"];
            
            
            var client = new AmazonCognitoIdentityProviderClient(region);
            
            var request = new AdminDeleteUserRequest
            {
                UserPoolId = userPoolId,
                Username = email,
            };

            //Delete user from user pool
            await client.AdminDeleteUserAsync(request);
            
            //Delete user from DynamoDB
            await context.DeleteAsync(existingUser);

            return new BaseResponse(true, "User Deleted Successfully.✌️", null);
            
            
        }
        catch (UserNotFoundException)
        {
            Console.WriteLine($"User '{email}' not found in the user pool.");
            return new BaseResponse(false, "User '{userData.Email}' not found in the user pool.", null);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error deleting user: {ex.Message}");
            return new BaseResponse(false, $"Error deleting user: {ex.Message}", ex.Message);
        }
    }
    
    public async Task<BaseResponse> GetUsers()
    {
        try
        {
            var users = await context.ScanAsync<Models.User>(new List<ScanCondition>()).GetRemainingAsync();
            return new BaseResponse(true, "Get Users Successfully.✌️", new { Users = users });
        }
        catch (Exception ex)
        {
            return new BaseResponse(false, "Oh... Failed to Get Users.😒", ex.Message);
        }
    }
    
}