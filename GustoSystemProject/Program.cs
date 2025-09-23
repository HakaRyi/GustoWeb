using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Repository;
using Repository.DBContext;
using Service;
using Service.AutoMapper;
using Service.Settings;
using System.Text.Json.Serialization;
;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<GustoSystemContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
});

//JWT Setting
var jwtSetting = new JwtSettings();
builder.Configuration.GetSection("JwtSettings").Bind(jwtSetting);
builder.Services.AddSingleton(jwtSetting);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme =  JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer("JwtBearer", options =>
{     options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSetting.Issuer,
        ValidAudience = jwtSetting.Audience,
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtSetting.SecretKey)),
        ClockSkew = TimeSpan.FromMinutes(jwtSetting.ExpiryMinutes)
    };
});

builder.Services.AddAuthorization();
//End JWT Setting
builder.Services.AddHttpContextAccessor();

//Dependency Injection:
builder.Services.AddScoped<AccountService>();
builder.Services.AddScoped<RoleService>();
builder.Services.AddScoped<NotificationService>();

builder.Services.AddScoped<AccountRepository>();
builder.Services.AddScoped<RoleRepository>();
builder.Services.AddScoped<RefreshTokenRepository>();
builder.Services.AddScoped<NotificationRepository>();
//End Dependency Injection


builder.Services.AddAutoMapper(typeof(AutoMapperConfig).Assembly);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
