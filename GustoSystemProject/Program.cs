using System.Collections;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repository;
using Repository.DBContext;
using Service;
using Service.AutoMapper;
using Service.Config;
using Service.Exceptions;
using Service.Settings;


var builder = WebApplication.CreateBuilder(args);
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddEnvironmentVariables() // <-- ??a dòng này LÊN TR??C
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true);


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
    });

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



//SMTP Settings
builder.Services.Configure<SmtpSettings>(
    builder.Configuration.GetSection("Email"));
var connectionString =
    Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<GustoSystemContext>(options =>
    options.UseSqlServer(connectionString));

//Repo
builder.Services.AddScoped<RestaurantLayoutRepository>();
builder.Services.AddScoped<RestaurantMenuRepository>();
builder.Services.AddScoped<RestaurantProfileRepository>();
builder.Services.AddScoped<RestaurantTableRepository>();
builder.Services.AddScoped<FavouriteRepository>();
builder.Services.AddScoped<FoodReviewRepository>();


// JWT Settings
var jwtSetting = new JwtSettings();
builder.Configuration.GetSection("JwtSettings").Bind(jwtSetting);
builder.Services.AddSingleton(jwtSetting);
//builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; // "Bearer"
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSetting.Issuer,
        ValidAudience = jwtSetting.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSetting.SecretKey)
        ),
        ClockSkew = TimeSpan.Zero
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("AccessToken"))
            {
                context.Token = context.Request.Cookies["AccessToken"];
            }
            return Task.CompletedTask;
        }
    };
});
//builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
//.AddCookie(options =>
//{
//    options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
//    options.SlidingExpiration = true;
//});

builder.Services.AddAuthorization();
builder.Services.AddHttpContextAccessor();

// Dependency Injection
builder.Services.AddScoped<AccountService>();
builder.Services.AddScoped<RoleService>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddScoped<RestaurantProfileService>();
builder.Services.AddScoped<RestaurantLayoutService>();
builder.Services.AddScoped<RestaurantTableService>();
builder.Services.AddScoped<RestaurantMenuService>();
builder.Services.AddScoped<FavouriteService>();
builder.Services.AddScoped<FoodReviewService>();
builder.Services.AddScoped<DinerProfileService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<OrderDetailService>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<PaymentMerchantService>();
builder.Services.AddScoped<TasteService>();
builder.Services.AddScoped<OptionalService>();
builder.Services.AddScoped<ContactService>();
builder.Services.AddScoped<PayOsPaymentService>();
builder.Services.AddScoped<TransactionService>();
builder.Services.Configure<PayOsSettings>(
    builder.Configuration.GetSection("PayOS")
    );
builder.Services.AddScoped<PromotionService>();

builder.Services.AddScoped<AccountRepository>();
builder.Services.AddScoped<RoleRepository>();
builder.Services.AddScoped<RefreshTokenRepository>();
builder.Services.AddScoped<NotificationRepository>();
builder.Services.AddScoped<RestaurantLayoutRepository>();
builder.Services.AddScoped<RestaurantMenuRepository>();
builder.Services.AddScoped<RestaurantProfileRepository>();
builder.Services.AddScoped<RestaurantTableRepository>();
builder.Services.AddScoped<DinerProfileRepository>();
builder.Services.AddScoped<OrderRepository>();
builder.Services.AddScoped<OrderDetailRepository>();
builder.Services.AddScoped<BookingRepository>();
builder.Services.AddScoped<PaymentMerchantRepository>();
builder.Services.AddScoped<TasteRepository>();
builder.Services.AddScoped<OptionalRepository>();
builder.Services.AddScoped<ContactRepository>();
builder.Services.AddScoped<TransactionRepository>();
builder.Services.AddScoped<PromotionRepository>();


builder.Services.AddSingleton<SpeedSmsService>();

builder.Services.AddAutoMapper(typeof(AutoMapperConfig).Assembly);

// CORS and Cookie
var CorsPolicyName = "AllowSwaggerAndFrontend";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CorsPolicyName,
        policy =>
        {
            policy.WithOrigins("https://localhost:7176", "http://localhost:3000", "https://localhost:3000") // Swagger UI domain
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.ConfigObject.AdditionalItems["withCredentials"] = true;
    });
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
//app.UseHttpsRedirection();

app.UseCors(CorsPolicyName);
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "healthy", time = DateTime.UtcNow }));
app.MapGet("/debug-config", () => new
{
    Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
    ConnectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "NULL - L?I!",
    JwtSecret = builder.Configuration["JwtSettings:SecretKey"] ?? "NULL",
    EmailHost = builder.Configuration["Email:Host"] ?? "NULL"
});
app.Run();
