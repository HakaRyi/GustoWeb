using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Repository;
using Repository.DBContext;
using Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<GustoSystemContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
//Repo
builder.Services.AddScoped<RestaurantLayoutRepository>();
builder.Services.AddScoped<RestaurantMenuRepository>();
builder.Services.AddScoped<RestaurantProfileRepository>();
builder.Services.AddScoped<RestaurantTableRepository>();
builder.Services.AddScoped<FavouriteRepository>();

//Service
builder.Services.AddScoped<RestaurantProfileService>();
builder.Services.AddScoped<RestaurantLayoutService>();
builder.Services.AddScoped<RestaurantTableService>();
builder.Services.AddScoped<RestaurantMenuService>();
builder.Services.AddScoped<FavouriteService>(); 


builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
});


builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
