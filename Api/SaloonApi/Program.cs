using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using SaloonApi.Services;
using SaloonApi.Services.Appointment;
using SaloonApi.Services.Client;
using SaloonApi.Services.Dashboard;
using SaloonApi.Services.Product;
using SaloonApi.Services.Therapist;
using SaloonApi.Services.Treatment;
using SaloonApi.Services.User;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendDev", policy =>
    {
        //policy.WithOrigins("http://localhost:5173") // frontend origin
        //      .AllowAnyHeader()
        //      .AllowAnyMethod();

        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// Add services to the container.
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());

// Register AWS DynamoDB services
builder.Services.AddAWSService<IAmazonDynamoDB>();
builder.Services.AddScoped<IDynamoDBContext, DynamoDBContext>();


builder.Services.AddAWSLambdaHosting(LambdaEventSource.RestApi);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Register Services
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<ITreatmentService, TreatmentService>();
builder.Services.AddScoped<ITherapistService, TherapistService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontendDev");

app.UseAuthorization();

app.MapControllers();

app.Run();