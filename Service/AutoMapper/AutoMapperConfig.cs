using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Repository.Models;
using Service.DTO.Response;

namespace Service.AutoMapper
{
    public class AutoMapperConfig : Profile
    {
        public AutoMapperConfig()
        {
            //Account Auto Mapper:
            CreateMap<Account, AccountResponse>();

            //Notification Mapper;
            CreateMap<Notification, NotificationResponse>();
        }
    }
}
