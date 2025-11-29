using AutoMapper;
using MailKit;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using Repository;
using Repository.ModelExtensions;
using Repository.Models;
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
                await client.ConnectAsync(_smtpSettings.Host, _smtpSettings.Port, MailKit.Security.SecureSocketOptions.Auto);

                await client.AuthenticateAsync(string.Empty, _smtpSettings.Password);

                await client.SendAsync(message);

                await client.DisconnectAsync(true);
            }
        }
    }
}
