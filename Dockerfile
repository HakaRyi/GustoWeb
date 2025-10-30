# ===================== BUILD STAGE =====================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy các file .csproj theo thứ tự dependency
COPY ["GustoSystemProject/GustoSystemProject.csproj", "GustoSystemProject/"]
COPY ["Repository/Repository.csproj", "Repository/"]
COPY ["Service/Service.csproj", "Service/"]

# Restore dependencies
RUN dotnet restore "GustoSystemProject/GustoSystemProject.csproj"

# Copy toàn bộ source code
COPY . .

# Build và publish project chính
WORKDIR "/src/GustoSystemProject"
RUN dotnet publish "GustoSystemProject.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ===================== RUNTIME STAGE =====================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy output từ build stage
COPY --from=build /app/publish .

# Mở port (Render hoặc local sẽ dùng PORT, fallback 8080)
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080}
EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["dotnet", "GustoSystemProject.dll"]