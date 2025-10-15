using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Repository;
using Repository.Models;
using Service.DTO.Request;

namespace Service
{
    public class OrderDetailService
    {
        private readonly OrderDetailRepository _repository;
        private readonly OrderRepository _orderRepository;
        private readonly RestaurantMenuRepository _menuRepository;
        private readonly OptionalRepository _optionalRepository;
        private readonly TasteRepository _tasteRepository;
        public OrderDetailService(OrderDetailRepository repository, OrderRepository orderRepository,
            RestaurantMenuRepository menuRepository, OptionalRepository optionalRepository, TasteRepository tasteRepository)
        {
            _repository = repository;
            _orderRepository = orderRepository;
            _menuRepository = menuRepository;
            _optionalRepository = optionalRepository;
            _tasteRepository = tasteRepository;
        }
        public async Task<List<OrderDetail>> GetAllDetails()
        {
            try
            {
                return await _repository.GetAllOrderDetailAsync();
            }
            catch (Exception ex)
            {
            }
            return new List<OrderDetail>();
        }
        public async Task<OrderDetail> GetByIdAsync(short detailId)
        {
            try
            {
                return await _repository.GetOrderDetailAsync(detailId);
            }
            catch (Exception ex)
            {
            }
            return new OrderDetail();
        }
        public async Task<int> CreateAsync(short foodId, short orderId)
        {
            try
            {
                var product = await _menuRepository.GetByIdAsync(foodId);
                var order = await _orderRepository.GetOrderAsync(orderId);
                if (order.Status != "Pending")
                {
                    throw new InvalidOperationException("Cannot add order detail to an order that is not pending.");
                }
                var detail = new OrderDetail
                {
                    FoodId = foodId,
                    FoodPrice = product.Price,
                    NumberOfFood = 1,
                    OrderId = orderId

                };
                return await _repository.CreateAsync(detail);
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task AddOrderDetailAsync(short orderId, int menuId)
        {
            var product = await _menuRepository.GetByIdAsync(menuId);
            var order = await _orderRepository.GetOrderAsync(orderId);
            if (order.Status != "Pending")
            {
                throw new InvalidOperationException("Cannot add order detail to an order that is not pending.");
            }
            var orderDetail = new OrderDetail
            {
                FoodId = short.Parse(menuId.ToString()),
                NumberOfFood = 1,
                FoodPrice = product.Price,
                OrderId = orderId
            };

            await _repository.CreateAsync(orderDetail);
            
        }
        public async Task AddOrderDetailAsync2(short orderId, short menuId, AddOrderDetailRequest request)
        {
         
            if (request.Quantity <= 0)
                throw new ArgumentException("Quantity must be greater than 0.");

            var food = await _menuRepository.GetByIdAsync(menuId);
            if (food == null)
                throw new Exception($"Food with ID {menuId} not found.");

            var order = await _orderRepository.GetOrderAsync(orderId);
            if (order == null)
                throw new Exception($"Order with ID {orderId} not found.");

            if (order.Status != "Pending")
                throw new InvalidOperationException("Cannot add order detail to an order that is not pending.");

            decimal totalPrice = food.Price;
            var orderDetail = new OrderDetail
            {
                FoodId = menuId,
                FoodPrice = food.Price,
                NumberOfFood = request.Quantity,
                OrderId = orderId,
                Optionals = new List<Optional>(),
                Tastes = new List<Taste>()
            };

            try
            {
             
                if (request.OptionalIds != null && request.OptionalIds.Any())
                {
                    foreach (var optionalId in request.OptionalIds.Distinct()) //loại bỏ duplicate
                    {
                        var optional = await _optionalRepository.GetByIdAsync(optionalId);
                        if (optional == null)
                            throw new Exception($"Optional with ID {optionalId} not found.");
                        if (optional.RestaurantMenuId != menuId)
                            throw new Exception($"Optional with ID {optionalId} does not belong to food ID {menuId}.");
                        orderDetail.Optionals.Add(optional);
                        totalPrice += optional.Price;
                    }
                }

                if (request.TasteIds != null && request.TasteIds.Any())
                {
                    foreach (var tasteId in request.TasteIds.Distinct()) //loại bỏ duplicate
                    {
                        var taste = await _tasteRepository.GetByIdAsync(tasteId);
                        if (taste == null)
                            throw new Exception($"Taste with ID {tasteId} not found.");
                        if (taste.RestaurantMenuId != menuId)
                            throw new Exception($"Taste with ID {tasteId} does not belong to food ID {menuId}.");
                        orderDetail.Tastes.Add(taste);
                    }
                }

                //save
                await _repository.CreateAsync(orderDetail);

                //update TotalPrice of order
                order.TotalPrice += totalPrice * request.Quantity;
                await _orderRepository.UpdateAsync(order);
            }
            catch (DbUpdateException ex)
            {
                var inner = ex.InnerException?.Message ?? ex.Message;
                throw new Exception($"Failed to save order detail: {inner}", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating order detail: {ex.Message}", ex);
            }
        }

        public async Task UpdateOrderDetailQuantity(short detailId, UpdateQuantityRequest request)
        {
            var orderDetail = await _repository.GetOrderDetailAsync(detailId);
            if (orderDetail == null)
                throw new Exception("Order detail not found");
            var order = await _orderRepository.GetOrderAsync(orderDetail.OrderId);
            if (order == null)
                throw new Exception("Order not found");
            orderDetail.NumberOfFood = request.Quantity;
            await _repository.UpdateAsync(orderDetail);
            await _orderRepository.UpdateAsync(order);
        }

        public async Task<int> UpdateAsync(short detailId, short dinnerId)
        {
            try
            {
                var detail = await _repository.GetOrderDetailAsync(detailId);
                if(detail != null && detail.Order.Booking.DinerId == dinnerId)
                {
                    return await _repository.UpdateAsync(detail);
                }
                return 0;
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        public async Task<bool> DeleteAsync(short detailId, short dinnerId)
        {
            try
            {
                var detail = await _repository.GetOrderDetailAsync(detailId);
                if (detail != null && detail.Order.Booking.DinerId == dinnerId)
                {
                    return await _repository.DeleteAsync(detailId);
                }
                return false;
            }
            catch (Exception ex)
            {

            }
            return false;
        }
    }
}
