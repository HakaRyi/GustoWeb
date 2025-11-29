using System.Text.Json;
using AutoMapper;
using MailKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using Repository;
using Repository.ModelExtensions;
using Repository.Models;
using RestSharp;
using Service.DTO.Request;
using Service.DTO.Response;
using Service.Settings;

namespace Service
{
    public class NotificationService
    {
        private readonly NotificationRepository _notifiationRepository;

        private readonly IMapper _mapper;
        private readonly ILogger<NotificationService> _logger;
        private readonly SmtpSettings _smtpSettings;


        public NotificationService(ILogger<NotificationService> logger, IMapper mapper, NotificationRepository notifiationRepository, IOptions<SmtpSettings> smtpSettings)
        {
            _logger = logger;
            _mapper = mapper;
            _notifiationRepository = notifiationRepository;
            _smtpSettings = smtpSettings.Value;
        }

        //CRUD Operations:
        public async Task<NotificationResponse> CreateNotification(Notification notification)
        {
            var res = await _notifiationRepository.Create(notification);
            return _mapper.Map<NotificationResponse>(res);
        }

        public async Task<NotificationResponse> GetById(int id)
        {
            var result = await _notifiationRepository.GetById(id);
            return _mapper.Map<NotificationResponse>(result);
        }

        public async Task<List<NotificationResponse>> GetAll()
        {
            var result = await _notifiationRepository.GetAll();
            return result.Select(x => _mapper.Map<NotificationResponse>(x)).ToList();
        }

        public async Task<PaginationResult<List<Notification>>> GetAllPaging(int currentPage, int pageSize)
        {
            var result = await _notifiationRepository.GetAllPaging(currentPage, pageSize);
            return result;
        }
        public async Task<NotificationResponse> UpdateNotification(Notification notification)
        {
            var res = await _notifiationRepository.Update(notification);
            return _mapper.Map<NotificationResponse>(res);
        }
        public async Task<bool> DeleteNotification(int id)
        {
            return await _notifiationRepository.Delete(id);
        }

        public async Task<List<NotificationResponse>> GetByAccountId(short accountId)
        {
            var result =  await _notifiationRepository.GetByAccountId(accountId);
            return result.Select(x => _mapper.Map<NotificationResponse>(x)).ToList();
        }

        //End CRUD Operations
        //Other Functions
        public async Task SendEmailAsync(SendEmailRequest request)
        {

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Gusto - Say it, Savor it", _smtpSettings.User));
            message.To.Add(new MailboxAddress(request.ReceiverName, request.ReceiverMail));
            message.Subject = request.Subject;

            message.Body = new TextPart("plain")
            {
                Text = request.Messenger
            };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_smtpSettings.Host, _smtpSettings.Port, SecureSocketOptions.SslOnConnect);

                await client.AuthenticateAsync(_smtpSettings.User ,_smtpSettings.Password);

                await client.SendAsync(message);

                await client.DisconnectAsync(true);
            }
        }
        public async Task SendEmailAsync2(SendEmailRequest request)
        {
            try
            {
                var client = new RestClient("https://api.brevo.com/v3/smtp/email");

                var body = new
                {
                    sender = new
                    {
                        name = "Gusto - Say it, Savor it",
                        email = "haxuankhang194@gmail.com"
                    },
                    to = new[]
                    {
                        new { email = request.ReceiverMail, name = request.ReceiverName }
                    },
                    subject = request.Subject,
                    htmlContent = $"<p>{request.Messenger}</p>"
                };

                var restRequest = new RestRequest("", Method.Post);
                restRequest.AddHeader("api-key", _smtpSettings.ApiKey);
                restRequest.AddHeader("Content-Type", "application/json");
                restRequest.AddStringBody(JsonSerializer.Serialize(body), DataFormat.Json);

                var response = await client.ExecuteAsync(restRequest);

                if (!response.IsSuccessful)
                {
                    _logger.LogError("Brevo API Error: " + response.Content);
                    throw new Exception("Cannot send email: " + response.Content);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending email via Brevo API");
                throw;
            }
        }
    }
}
