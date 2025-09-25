using AutoMapper;
using Microsoft.Extensions.Logging;
using Repository;
using Repository.ModelExtensions;
using Repository.Models;
using Service.DTO.Response;
using System.Threading.Tasks;

namespace Service
{
    public class NotificationService
    {
        private readonly NotificationRepository _notifiationRepository;

        private readonly IMapper _mapper;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(ILogger<NotificationService> logger, IMapper mapper, NotificationRepository notifiationRepository)
        {
            _logger = logger;
            _mapper = mapper;
            _notifiationRepository = notifiationRepository;
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
    }
}
