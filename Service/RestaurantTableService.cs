using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Repository;
using Repository.Models;
using Service.DTO.Request;
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
        public async Task<List<RestaurantTableResponse>> GetByAccountAsync(int accId)
        {
            try
            {
                return await repository.GetByAccountAsync(accId)
                    .ContinueWith(task => task.Result.Select(resTab => new RestaurantTableResponse
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
            catch (Exception e)
            {

            }
            return new List<RestaurantTableResponse>();
        }
        public async Task<int> CreateTableAsync(RestaurantTableRequest request, short tableId)
        {
            var newItem = new RestaurantTable
            {
                Name = request.Name,
                Description = request.Description,
                PersonNumber = request.PersonNumber,
                Position = request.Position,
                Status = request.Status.ToString(),
                IsVip = request.IsVip,
                MinCharge = request.MinCharge,
                Deposit = request.Deposit
            };
            return await repository.CreateAsync(newItem);
        }
        public async Task<int> UpdateTableAsync(RestaurantTableRequest request, int tableId)
        {
            var item = await GetByIdAsync(tableId);
            if (item == null)
            {
                throw new KeyNotFoundException($"Table with ID {tableId} not found.");
            }
            item.Name = request.Name;
            item.Description = request.Description;
            item.PersonNumber = request.PersonNumber;
            item.Position = request.Position;
            item.Status = request.Status.ToString(); 
            item.IsVip = request.IsVip;
            item.MinCharge = request.MinCharge;
            item.Deposit = request.Deposit;

            return await repository.UpdateAsync(item);
        }
        public async Task<int> DeleteTableAsync(int tableId)
        {
            var item = await GetByIdAsync(tableId);
            if (item == null)
            {
                throw new KeyNotFoundException($"Table with ID {tableId} not found.");
            }
            return await repository.DeleteAsync(tableId);
        }
    }
}
