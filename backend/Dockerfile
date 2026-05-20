FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ["TaskFlow.API.csproj", "./"]
RUN dotnet restore "TaskFlow.API.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "TaskFlow.API.csproj" -c Release -o /out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .

# Expose port 8080 
EXPOSE 8080

ENTRYPOINT ["dotnet", "TaskFlow.API.dll"]
