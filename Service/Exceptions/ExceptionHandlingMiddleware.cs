using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Authentication;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Service.Exceptions
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");

                context.Response.ContentType = "application/json";

                // Mặc định 500
                var statusCode = (int)HttpStatusCode.InternalServerError;
                var message = "Internal server error";

                // Mapping exception -> status code
                switch (ex)
                {
                    case UsernameAlreadyExistsException:
                        statusCode = (int)HttpStatusCode.Conflict; // 409
                        message = ex.Message;
                        break;
                    case InvalidCredentialsException:
                        statusCode = (int)HttpStatusCode.Unauthorized; // 401
                        message = ex.Message;
                        break;
                    case NotFoundException:
                        statusCode = (int)HttpStatusCode.NotFound; // 404
                        message = ex.Message;
                        break;
                    case ForbiddenException:
                        statusCode = (int)HttpStatusCode.Forbidden; // 403
                        message = ex.Message;
                        break;
                }

                context.Response.StatusCode = statusCode;

                var result = new
                {
                    error = new
                    {
                        code = statusCode,
                        message = message
                    }
                };

                context.Response.StatusCode = statusCode;
                context.Response.ContentType = "application/json";

                var json = JsonSerializer.Serialize(result);
                await context.Response.WriteAsync(json);
            }
        }
    }
}
