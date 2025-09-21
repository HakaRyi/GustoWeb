using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Repository;
using Repository.Models;
using Service.DTO.Response;

namespace Service
{
    public class RestaurantTableService
    {
        private readonly RestaurantTableRepository repository;
        public RestaurantTableService(RestaurantTableRepository repository)
        {
            this.repository = repository;
        }
        public async Task<List<RestaurantTable>> GetAllAsync1()
        {
            try
            {
                return await repository.GetAll();

            }
            catch (Exception ex)
            {
            }
            return new List<RestaurantTable>();
        }
        public async Task<RestaurantTable> GetByIdAsync(int id)
        {
            try
            {
                return await repository.GetByIdAsync(id);

            }
            catch (Exception ex)
            {
            }
            return new RestaurantTable();
        }
        public async Task<List<RestaurantTableResponse>> GetAllAsync2()
        {
            try
            {
                return await repository.GetAll()
                    .ContinueWith(task=>task.Result.Select(resTab => new RestaurantTableResponse
                    {
                    TableId = resTab.TableId,
                    RestaurantName = resTab.Account?.FullName,
                    Name = resTab.Name,
                    Deposit = resTab.Deposit,
                    Description = resTab.Description,
                    IsVip = resTab.IsVip,
                    MinCharge = resTab.MinCharge,
                    PersonNumber = resTab.PersonNumber,
                    Position = resTab.Position,
                    Status = resTab.Status 


                }).ToList());
                 
 
            }
            catch (Exception ex)
            {
            }
            return new List<RestaurantTableResponse>();
        }
        public async Task<RestaurantTableResponse> GetByIdAsync2(int id)
        {
            try
            {
                var item = await repository.GetByIdAsync(id);
                return new RestaurantTableResponse
                {
                    TableId = item.TableId,
                    RestaurantName = item.Account.FullName,
                    Name = item.Name,
                    Deposit = item.Deposit,
                    Description = item.Description,
                    IsVip = item.IsVip,
                    MinCharge = item.MinCharge,
                    PersonNumber = item.PersonNumber,
                    Position = item.Position,
                    Status = item.Status

                };
            }
            catch (Exception e)
            {

            }
            return new RestaurantTableResponse();
        }
    }
}
